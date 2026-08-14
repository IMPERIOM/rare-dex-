"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Save, Boxes, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

const AVAIL_OPTIONS = ["in-stock", "low-stock", "pre-order", "backorder", "out-of-stock"];

const AVAIL_STYLE: Record<string, { color: string; bg: string }> = {
  "in-stock": { color: "#10b981", bg: "#10b98115" },
  "low-stock": { color: "#fbbf24", bg: "#fbbf2415" },
  "pre-order": { color: "#3b82f6", bg: "#3b82f615" },
  "backorder": { color: "#a78bfa", bg: "#7c3aed15" },
  "out-of-stock": { color: "#ef4444", bg: "#ef444415" },
};

type Product = { id: string; name: string; sku: string; stock: number; price: number; availability: string; updated_at: string };

export function AdminInventoryClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [edits, setEdits] = useState<Record<string, Partial<Product>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setEdits({});
    try {
      const params = q ? `?q=${encodeURIComponent(q)}` : "";
      const r = await fetch(`/api/admin/inventory${params}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setProducts(d.inventory || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => { load(); }, [load]);

  function setEdit(id: string, field: string, value: any) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    setSaved(prev => ({ ...prev, [id]: false }));
  }

  async function saveProduct(id: string) {
    const edit = edits[id];
    if (!edit || Object.keys(edit).length === 0) return;
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      const r = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...edit }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...d.product } : p));
      setEdits(prev => { const n = { ...prev }; delete n[id]; return n; });
      setSaved(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setSaved(prev => ({ ...prev, [id]: false })), 2000);
    } catch (e: any) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  }

  function getVal(p: Product, field: keyof Product) {
    return edits[p.id]?.[field] ?? p[field];
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQ(searchInput);
  }

  return (
    <AdminShell>
      <div style={{ padding: "2rem 1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ color: "#f5f6fa", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.25rem", letterSpacing: "-0.02em" }}>Inventory</h1>
            <p style={{ color: "#6b6b80", fontSize: "0.875rem", margin: 0 }}>{products.length} products — edit stock, price and availability inline</p>
          </div>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} color="#6b6b80" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search products…"
                style={{
                  background: "#0d0d18", border: "1px solid #ffffff14", borderRadius: "0.75rem",
                  padding: "0.55rem 1rem 0.55rem 2rem", color: "#f5f6fa", fontSize: "0.85rem",
                  outline: "none", width: "200px",
                }}
                onFocus={e => (e.target.style.borderColor = "#3b82f6")}
                onBlur={e => (e.target.style.borderColor = "#ffffff14")}
              />
            </div>
            <button type="submit" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", border: "none", borderRadius: "0.75rem", padding: "0.55rem 1rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
              Search
            </button>
          </form>
        </div>

        {error && (
          <div style={{ background: "#ef444415", border: "1px solid #ef444430", borderRadius: "0.75rem", padding: "1rem", color: "#fca5a5", marginBottom: "1rem" }}>{error}</div>
        )}

        <div style={{ background: "linear-gradient(180deg, #16161f 0%, #101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#6b6b80" }}>Loading inventory…</div>
          ) : products.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#6b6b80" }}>
              <Boxes size={40} style={{ display: "block", margin: "0 auto 0.75rem", opacity: 0.3 }} />
              No products found. Run the migration and ensure the database is seeded.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                <thead>
                  <tr style={{ background: "#0d0d18" }}>
                    {["PRODUCT", "SKU", "STOCK", "PRICE (USD)", "AVAILABILITY", "UPDATED", ""].map(h => (
                      <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: "left", color: "#6b6b80", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const avail = String(getVal(p, "availability"));
                    const avStyle = AVAIL_STYLE[avail] || AVAIL_STYLE["out-of-stock"];
                    const isDirty = !!(edits[p.id] && Object.keys(edits[p.id]).length > 0);
                    const stockVal = Number(getVal(p, "stock"));
                    const isLow = stockVal <= 10 && stockVal > 0;
                    const isOut = stockVal === 0;

                    return (
                      <tr key={p.id} style={{ borderTop: "1px solid #ffffff0d", background: isDirty ? "#3b82f606" : "transparent" }}>
                        <td style={{ padding: "0.875rem 1.25rem", maxWidth: "260px" }}>
                          <div style={{ color: "#f5f6fa", fontSize: "0.875rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.name}>{p.name}</div>
                        </td>
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <code style={{ color: "#a1a1b5", fontSize: "0.78rem", background: "#ffffff08", padding: "0.2rem 0.5rem", borderRadius: "0.375rem" }}>{p.sku || "—"}</code>
                        </td>
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                              type="number"
                              min={0}
                              value={String(getVal(p, "stock"))}
                              onChange={e => setEdit(p.id, "stock", parseInt(e.target.value, 10) || 0)}
                              style={{
                                width: "70px", background: "rgba(255,255,255,0.04)", border: "1px solid #ffffff18",
                                borderRadius: "0.5rem", padding: "0.4rem 0.6rem", color: "#f5f6fa",
                                fontSize: "0.875rem", fontWeight: 700, outline: "none", textAlign: "center",
                              }}
                              onFocus={e => (e.target.style.borderColor = "#3b82f6")}
                              onBlur={e => (e.target.style.borderColor = "#ffffff18")}
                            />
                            {isLow && !isOut && <span title="Low stock"><AlertTriangle size={13} color="#fbbf24" /></span>}
                            {isOut && <span style={{ color: "#ef4444", fontSize: "0.7rem", fontWeight: 700 }}>OUT</span>}
                          </div>
                        </td>
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <span style={{ color: "#6b6b80", fontSize: "0.85rem" }}>$</span>
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              value={String(getVal(p, "price"))}
                              onChange={e => setEdit(p.id, "price", parseFloat(e.target.value) || 0)}
                              style={{
                                width: "90px", background: "rgba(255,255,255,0.04)", border: "1px solid #ffffff18",
                                borderRadius: "0.5rem", padding: "0.4rem 0.6rem", color: "#f5f6fa",
                                fontSize: "0.875rem", fontWeight: 700, outline: "none",
                              }}
                              onFocus={e => (e.target.style.borderColor = "#fbbf24")}
                              onBlur={e => (e.target.style.borderColor = "#ffffff18")}
                            />
                          </div>
                        </td>
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <select
                            value={avail}
                            onChange={e => setEdit(p.id, "availability", e.target.value)}
                            style={{
                              background: avStyle.bg, border: `1px solid ${avStyle.color}30`,
                              borderRadius: "0.5rem", padding: "0.4rem 0.6rem",
                              color: avStyle.color, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                              outline: "none",
                            }}
                          >
                            {AVAIL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "0.875rem 1.25rem", color: "#6b6b80", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                          {new Date(p.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          {saved[p.id] ? (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#10b981", fontSize: "0.78rem", fontWeight: 700 }}>
                              <CheckCircle2 size={13} /> Saved
                            </span>
                          ) : (
                            <button
                              onClick={() => saveProduct(p.id)}
                              disabled={!isDirty || saving[p.id]}
                              style={{
                                display: "flex", alignItems: "center", gap: "0.3rem",
                                background: isDirty ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "#ffffff08",
                                color: isDirty ? "#fff" : "#4b4b60",
                                border: "none", borderRadius: "0.5rem",
                                padding: "0.4rem 0.75rem", fontSize: "0.78rem", fontWeight: 700,
                                cursor: isDirty ? "pointer" : "not-allowed",
                                boxShadow: isDirty ? "0 2px 10px #3b82f640" : "none",
                                transition: "all 0.15s",
                              }}
                            >
                              <Save size={12} /> {saving[p.id] ? "Saving…" : "Save"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
