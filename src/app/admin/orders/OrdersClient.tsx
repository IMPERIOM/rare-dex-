"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Clock, ChevronRight, ShoppingBag } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function fmtDate(s: string) {
  return new Date(s).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "#fbbf2418", color: "#fbbf24" },
  PAID: { bg: "#10b98118", color: "#10b981" },
  CANCELED: { bg: "#ef444418", color: "#ef4444" },
};

const FILTERS = ["all", "pending", "paid", "canceled"];

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (q) params.set("q", q);
      const r = await fetch(`/api/admin/orders?${params}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setOrders(d.orders || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter, q]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQ(searchInput);
  }

  return (
    <AdminShell>
      <div style={{ padding: "2rem 1.5rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ color: "#f5f6fa", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.25rem", letterSpacing: "-0.02em" }}>Orders</h1>
          <p style={{ color: "#6b6b80", fontSize: "0.875rem", margin: 0 }}>{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "0.35rem", background: "#0d0d18", border: "1px solid #ffffff0d", borderRadius: "0.875rem", padding: "0.3rem" }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.4rem 0.9rem", borderRadius: "0.6rem", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, textTransform: "capitalize", transition: "all 0.15s", background: filter === f ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "transparent", color: filter === f ? "#fff" : "#6b6b80", boxShadow: filter === f ? "0 2px 10px #3b82f640" : "none" }}>
                {f}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} color="#6b6b80" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search email or ref…" style={{ background: "#0d0d18", border: "1px solid #ffffff14", borderRadius: "0.75rem", padding: "0.55rem 1rem 0.55rem 2rem", color: "#f5f6fa", fontSize: "0.85rem", outline: "none", width: "220px" }} onFocus={e => (e.target.style.borderColor = "#3b82f6")} onBlur={e => (e.target.style.borderColor = "#ffffff14")} />
            </div>
            <button type="submit" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", border: "none", borderRadius: "0.75rem", padding: "0.55rem 1rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>Search</button>
          </form>
        </div>

        {error && <div style={{ background: "#ef444415", border: "1px solid #ef444430", borderRadius: "0.75rem", padding: "1rem", color: "#fca5a5", marginBottom: "1rem" }}>{error}</div>}

        <div style={{ background: "linear-gradient(180deg, #16161f 0%, #101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#6b6b80" }}>Loading orders…</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#6b6b80" }}>
              <ShoppingBag size={40} style={{ display: "block", margin: "0 auto 0.75rem", opacity: 0.3 }} />
              No orders match your filters.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                <thead>
                  <tr style={{ background: "#0d0d18" }}>
                    {["REF", "DATE", "CUSTOMER", "TOTAL", "PAYMENT EMAIL", "STATUS", ""].map(h => (
                      <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: "left", color: "#6b6b80", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => {
                    const st = STATUS_STYLE[o.status] || STATUS_STYLE.PENDING;
                    return (
                      <tr key={o.id} style={{ borderTop: "1px solid #ffffff0d", transition: "background 0.15s" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "#ffffff04")}
                        onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                      >
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <Link href={`/admin/orders/${o.id}`} style={{ color: "#3b82f6", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", fontFamily: "monospace" }}>{o.ref || o.id.slice(0, 8).toUpperCase()}</Link>
                        </td>
                        <td style={{ padding: "1rem 1.25rem", color: "#a1a1b5", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <Clock size={11} style={{ opacity: 0.5 }} /> {fmtDate(o.created_at)}
                          </div>
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <div style={{ color: "#f5f6fa", fontSize: "0.875rem", fontWeight: 600 }}>{o.customer_name}</div>
                          <div style={{ color: "#6b6b80", fontSize: "0.75rem" }}>{o.email}</div>
                        </td>
                        <td style={{ padding: "1rem 1.25rem", color: "#f5f6fa", fontSize: "0.9rem", fontWeight: 700 }}>{formatUSD(Number(o.total_eur))}</td>
                        <td style={{ padding: "1rem 1.25rem", color: "#6b6b80", fontSize: "0.8rem" }}>
                          {o.payment_email_sent_at
                            ? <span style={{ color: "#10b981" }}>Sent {fmtDate(o.payment_email_sent_at)}</span>
                            : "—"}
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <span style={{ padding: "0.3rem 0.75rem", borderRadius: "9999px", background: st.bg, color: st.color, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em" }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <Link href={`/admin/orders/${o.id}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#a1a1b5", fontSize: "0.8rem", textDecoration: "none" }}>
                            View <ChevronRight size={13} />
                          </Link>
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
