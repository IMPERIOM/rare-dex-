"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { BarChart2, TrendingUp, DollarSign, ShoppingBag, Users, Package2 } from "lucide-react";

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function parseLines(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw || "[]"); } catch { return []; }
}

export function AdminAnalyticsClient() {
  const [stats, setStats]   = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [sRes, oRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/orders"),
      ]);
      const [sd, od] = await Promise.all([sRes.json(), oRes.json()]);
      setStats(sd);
      setOrders(od.orders || []);
      setLoading(false);
    }
    load();
  }, []);

  const totalRevenue  = orders.filter(o => o.status === "PAID").reduce((s, o) => s + Number(o.total_eur), 0);
  const avgOrderValue = orders.length > 0 ? orders.reduce((s, o) => s + Number(o.total_eur), 0) / orders.length : 0;
  const convRate      = orders.length > 0
    ? ((orders.filter(o => o.status === "PAID").length / orders.length) * 100).toFixed(1)
    : "0.0";
  const uniqueEmails  = new Set(orders.map(o => o.email));

  // Country breakdown from shipping_address JSONB
  const countryMap: Record<string, number> = {};
  orders.forEach(o => {
    let country = "Unknown";
    try {
      const addr = typeof o.shipping_address === "object" ? o.shipping_address : JSON.parse(o.shipping_address || "{}");
      country = addr.country || o.country || "Unknown";
    } catch {}
    countryMap[country] = (countryMap[country] || 0) + 1;
  });
  const topCountries = Object.entries(countryMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Payment method breakdown
  const pmMap: Record<string, number> = {};
  orders.forEach(o => { pmMap[o.payment_method] = (pmMap[o.payment_method] || 0) + 1; });
  const pmBreakdown = Object.entries(pmMap).sort((a, b) => b[1] - a[1]);

  // Best-selling products from lines JSONB
  const productMap: Record<string, number> = {};
  orders.filter(o => o.status !== "CANCELED").forEach(o => {
    parseLines(o.lines).forEach((line: any) => {
      const name = line.product_name || line.name || line.slug || "Unknown";
      const qty  = Number(line.qty ?? line.quantity ?? 1);
      productMap[name] = (productMap[name] || 0) + qty;
    });
  });
  const topProducts = Object.entries(productMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const maxCountry = topCountries[0]?.[1] || 1;
  const maxPM      = pmBreakdown[0]?.[1]  || 1;

  const METRIC_CARDS = [
    { label: "Total Revenue",      value: formatUSD(totalRevenue),    icon: DollarSign,  color: "#10b981", glow: "#10b98130" },
    { label: "Total Orders",       value: orders.length,              icon: ShoppingBag, color: "#3b82f6", glow: "#3b82f630" },
    { label: "Avg. Order Value",   value: formatUSD(avgOrderValue),   icon: TrendingUp,  color: "#fbbf24", glow: "#fbbf2430" },
    { label: "Conversion Rate",    value: `${convRate}%`,             icon: BarChart2,   color: "#a78bfa", glow: "#7c3aed30" },
    { label: "Unique Customers",   value: uniqueEmails.size,          icon: Users,       color: "#f472b6", glow: "#ec489930" },
    { label: "Distinct Products",  value: Object.keys(productMap).length, icon: Package2, color: "#22d3ee", glow: "#22d3ee30" },
  ];

  return (
    <AdminShell>
      <div style={{ padding: "2rem 1.5rem", maxWidth: "1200px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ color: "#f5f6fa", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.25rem", letterSpacing: "-0.02em" }}>Analytics</h1>
          <p style={{ color: "#6b6b80", fontSize: "0.875rem", margin: 0 }}>All-time store performance overview</p>
        </div>

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#6b6b80" }}>Loading analytics…</div>
        ) : (
          <>
            {/* Metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {METRIC_CARDS.map(({ label, value, icon: Icon, color, glow }) => (
                <div key={label} style={{ background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", padding: "1.25rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "1rem", right: "1rem", width: "32px", height: "32px", borderRadius: "0.5rem", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "70px", height: "70px", borderRadius: "50%", background: glow, filter: "blur(20px)" }} />
                  <p style={{ color: "#6b6b80", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.4rem" }}>{label}</p>
                  <p style={{ color: "#f5f6fa", fontSize: "1.75rem", fontWeight: 800, margin: 0, lineHeight: 1 }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Countries */}
              <div style={{ background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #ffffff0d" }}>
                  <h2 style={{ color: "#f5f6fa", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>Orders by Country</h2>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  {topCountries.length === 0 ? (
                    <p style={{ color: "#6b6b80", fontSize: "0.85rem", textAlign: "center" }}>No data yet.</p>
                  ) : topCountries.map(([country, count]) => (
                    <div key={country} style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#f5f6fa", fontSize: "0.85rem", fontWeight: 600 }}>{country}</span>
                        <span style={{ color: "#a1a1b5", fontSize: "0.85rem", fontWeight: 700 }}>{count}</span>
                      </div>
                      <div style={{ height: "6px", background: "#ffffff08", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(count / maxCountry) * 100}%`, background: "linear-gradient(90deg,#3b82f6,#7c3aed)", borderRadius: "9999px", transition: "width 0.5s" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment methods */}
              <div style={{ background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #ffffff0d" }}>
                  <h2 style={{ color: "#f5f6fa", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>Payment Methods</h2>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  {pmBreakdown.length === 0 ? (
                    <p style={{ color: "#6b6b80", fontSize: "0.85rem", textAlign: "center" }}>No data yet.</p>
                  ) : pmBreakdown.map(([method, count]) => (
                    <div key={method} style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#f5f6fa", fontSize: "0.85rem", fontWeight: 600 }}>{method}</span>
                        <span style={{ color: "#a1a1b5", fontSize: "0.85rem", fontWeight: 700 }}>{count}</span>
                      </div>
                      <div style={{ height: "6px", background: "#ffffff08", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(count / maxPM) * 100}%`, background: "linear-gradient(90deg,#fbbf24,#f59e0b)", borderRadius: "9999px", transition: "width 0.5s" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best-sellers */}
              {topProducts.length > 0 && (
                <div style={{ background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", overflow: "hidden", gridColumn: "1 / -1" }}>
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #ffffff0d" }}>
                    <h2 style={{ color: "#f5f6fa", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>Best-Selling Products</h2>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                      <thead>
                        <tr style={{ background: "#0d0d18" }}>
                          {["#", "PRODUCT", "UNITS SOLD"].map(h => (
                            <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: h === "UNITS SOLD" ? "right" : "left", color: "#6b6b80", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map(([name, qty], i) => (
                          <tr key={i} style={{ borderTop: "1px solid #ffffff0d" }}>
                            <td style={{ padding: "0.875rem 1.25rem", color: "#3b82f6", fontWeight: 800 }}>{i + 1}</td>
                            <td style={{ padding: "0.875rem 1.25rem", color: "#f5f6fa", fontWeight: 600 }}>{name}</td>
                            <td style={{ padding: "0.875rem 1.25rem", color: "#fbbf24", fontWeight: 800, textAlign: "right" }}>{qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Status breakdown */}
            {stats && (
              <div style={{ marginTop: "1.5rem", background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", padding: "1.5rem" }}>
                <h2 style={{ color: "#f5f6fa", fontSize: "0.95rem", fontWeight: 700, margin: "0 0 1.25rem" }}>Order Status Breakdown</h2>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  {[
                    { label: "Pending",  count: stats.pending?.count  || 0, value: stats.pending?.value  || 0, color: "#fbbf24" },
                    { label: "Paid",     count: stats.paid?.count     || 0, value: stats.paid?.value     || 0, color: "#10b981" },
                    { label: "Canceled", count: stats.canceled?.count || 0, value: 0,                         color: "#ef4444" },
                  ].map(({ label, count, value, color }) => (
                    <div key={label} style={{ flex: 1, minWidth: "140px", padding: "1rem", background: `${color}0a`, border: `1px solid ${color}20`, borderRadius: "0.875rem" }}>
                      <div style={{ color, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>{label}</div>
                      <div style={{ color: "#f5f6fa", fontSize: "1.75rem", fontWeight: 800 }}>{count}</div>
                      {value > 0 && <div style={{ color: "#a1a1b5", fontSize: "0.82rem", marginTop: "0.25rem" }}>{formatUSD(value)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <style>{`
          @media (max-width: 768px) {
            div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </AdminShell>
  );
}
