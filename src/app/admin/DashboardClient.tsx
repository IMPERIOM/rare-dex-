"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, DollarSign, TrendingUp, XCircle,
  RefreshCw, ArrowRight, Clock, Package2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function timeSince(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "#fbbf2418", color: "#fbbf24" },
  PAID: { bg: "#10b98118", color: "#10b981" },
  CANCELED: { bg: "#ef444418", color: "#ef4444" },
};

export function AdminDashboardClient() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/stats");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setStats(d);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const STAT_CARDS = stats ? [
    { label: "Pending Orders", value: stats.pending.count, sub: formatUSD(stats.pending.value) + " awaiting payment", icon: ShoppingBag, color: "#fbbf24", glow: "#fbbf2430" },
    { label: "Paid Orders", value: stats.paid.count, sub: formatUSD(stats.paid.value) + " revenue", icon: DollarSign, color: "#10b981", glow: "#10b98130" },
    { label: "Orders (7 Days)", value: stats.last7Days.count, sub: formatUSD(stats.last7Days.revenue) + " this week", icon: TrendingUp, color: "#3b82f6", glow: "#3b82f630" },
    { label: "Canceled Orders", value: stats.canceled.count, sub: "All time", icon: XCircle, color: "#ef4444", glow: "#ef444430" },
  ] : [];

  return (
    <AdminShell>
      <div style={{ padding: "2rem 1.5rem", maxWidth: "1200px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ color: "#f5f6fa", fontSize: "1.75rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Dashboard</h1>
            <p style={{ color: "#6b6b80", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>Overview of your RareDexCards store</p>
          </div>
          <button onClick={load} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#ffffff08", border: "1px solid #ffffff14", borderRadius: "0.75rem", padding: "0.6rem 1rem", color: "#a1a1b5", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
            <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} /> Refresh
          </button>
        </div>

        {error && (
          <div style={{ background: "#ef444415", border: "1px solid #ef444430", borderRadius: "0.75rem", padding: "1rem 1.25rem", color: "#fca5a5", marginBottom: "1.5rem" }}>{error}</div>
        )}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ background: "#12121c", border: "1px solid #ffffff0d", borderRadius: "1rem", padding: "1.5rem", height: "110px", animation: "pulse 1.5s ease-in-out infinite" }} />)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {STAT_CARDS.map(({ label, value, sub, icon: Icon, color, glow }) => (
              <div key={label} style={{ background: "linear-gradient(180deg, #16161f 0%, #101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "1rem", right: "1rem", width: "36px", height: "36px", borderRadius: "0.625rem", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: glow, filter: "blur(20px)", pointerEvents: "none" }} />
                <p style={{ color: "#6b6b80", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.5rem" }}>{label}</p>
                <p style={{ color: "#f5f6fa", fontSize: "2rem", fontWeight: 800, margin: "0 0 0.25rem", lineHeight: 1 }}>{value}</p>
                <p style={{ color: "#6b6b80", fontSize: "0.8rem", margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {/* Recent orders */}
          <div style={{ background: "linear-gradient(180deg, #16161f 0%, #101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #ffffff0d" }}>
              <h2 style={{ color: "#f5f6fa", fontSize: "1rem", fontWeight: 700, margin: 0 }}>Latest Orders</h2>
              <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#3b82f6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b6b80" }}>Loading…</div>
            ) : !stats?.recentOrders?.length ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b6b80", fontSize: "0.9rem" }}>
                <ShoppingBag size={36} style={{ display: "block", margin: "0 auto 0.75rem", opacity: 0.4 }} />
                No orders yet
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                  <thead>
                    <tr style={{ background: "#0d0d18" }}>
                      {["REF", "CUSTOMER", "DATE", "TOTAL", "STATUS"].map(h => (
                        <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", color: "#6b6b80", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o: any) => {
                      const st = STATUS_STYLE[o.status] || STATUS_STYLE.PENDING;
                      return (
                        <tr key={o.id} style={{ borderTop: "1px solid #ffffff0d", transition: "background 0.15s" }}
                          onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "#ffffff04")}
                          onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                        >
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <Link href={`/admin/orders/${o.id}`} style={{ color: "#3b82f6", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", fontFamily: "monospace" }}>{o.ref || o.id.slice(0, 8).toUpperCase()}</Link>
                          </td>
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <div style={{ color: "#f5f6fa", fontSize: "0.875rem", fontWeight: 600 }}>{o.customer_name}</div>
                            <div style={{ color: "#6b6b80", fontSize: "0.75rem" }}>{o.email}</div>
                          </td>
                          <td style={{ padding: "1rem 1.25rem", color: "#a1a1b5", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <Clock size={12} style={{ opacity: 0.6 }} /> {timeSince(o.created_at)}
                            </div>
                          </td>
                          <td style={{ padding: "1rem 1.25rem", color: "#f5f6fa", fontSize: "0.9rem", fontWeight: 700 }}>{formatUSD(Number(o.total_eur))}</td>
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <span style={{ padding: "0.3rem 0.75rem", borderRadius: "9999px", background: st.bg, color: st.color, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em" }}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top products */}
          {stats?.topProducts?.length > 0 && (
            <div style={{ background: "linear-gradient(180deg, #16161f 0%, #101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #ffffff0d" }}>
                <h2 style={{ color: "#f5f6fa", fontSize: "1rem", fontWeight: 700, margin: 0 }}>Top Ordered Products</h2>
              </div>
              <div style={{ padding: "1rem" }}>
                {stats.topProducts.map((p: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0.5rem", borderBottom: i < stats.topProducts.length - 1 ? "1px solid #ffffff08" : "none" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "0.5rem", background: "#3b82f618", border: "1px solid #3b82f625", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#f5f6fa", fontSize: "0.875rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#fbbf24", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                      <Package2 size={13} /> {p.total_qty} units
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </AdminShell>
  );
}
