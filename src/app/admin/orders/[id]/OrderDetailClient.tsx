"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Mail, CheckCircle2, XCircle, Clock,
  MapPin, CreditCard, Package2, Send, FileText,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function fmtDate(s: string) {
  return new Date(s).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

const STATUS_OPTIONS = ["PENDING", "PAID", "CANCELED"];

const STATUS_STYLE: Record<string, { bg: string; color: string; icon: any }> = {
  PENDING: { bg: "#fbbf2418", color: "#fbbf24", icon: Clock },
  PAID:    { bg: "#10b98118", color: "#10b981", icon: CheckCircle2 },
  CANCELED:{ bg: "#ef444418", color: "#ef4444", icon: XCircle },
};

/** Parse the shipping_address JSONB field (which may already be an object) */
function parseAddr(raw: any): Record<string, string> {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try { return JSON.parse(raw); } catch { return {}; }
}

/** Parse the lines JSONB field */
function parseLines(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw || "[]"); } catch { return []; }
}

export function AdminOrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function loadOrder() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`/api/admin/orders/${orderId}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setOrder(d.order);
      setInstructions(d.order.payment_instructions || d.order.payment_details || "");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrder(); }, [orderId]);

  async function updateStatus(newStatus: string) {
    if (!order || order.status === newStatus) return;
    setStatusLoading(true);
    try {
      const r = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to update status");
      setOrder(d.order);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setStatusLoading(false);
    }
  }

  async function sendPaymentEmail() {
    if (!instructions.trim()) { setEmailError("Please enter payment instructions."); return; }
    setEmailSending(true);
    setEmailError("");
    setEmailSent(false);
    try {
      const r = await fetch(`/api/admin/orders/${orderId}/send-payment-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to send");
      setEmailSent(true);
      await loadOrder();
    } catch (e: any) {
      setEmailError(e.message);
    } finally {
      setEmailSending(false);
    }
  }

  if (loading) return <AdminShell><div style={{ padding: "3rem", textAlign: "center", color: "#6b6b80" }}>Loading order…</div></AdminShell>;
  if (error || !order) return (
    <AdminShell>
      <div style={{ padding: "2rem" }}>
        <div style={{ background: "#ef444415", border: "1px solid #ef444430", borderRadius: "0.75rem", padding: "1rem", color: "#fca5a5" }}>{error || "Order not found"}</div>
        <Link href="/admin/orders" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#3b82f6", marginTop: "1rem", textDecoration: "none" }}><ArrowLeft size={16} /> Back to Orders</Link>
      </div>
    </AdminShell>
  );

  const lines = parseLines(order.lines);
  const addr  = parseAddr(order.shipping_address);
  const st    = STATUS_STYLE[order.status] || STATUS_STYLE.PENDING;
  const StatusIcon = st.icon;
  const firstName = (order.customer_name || "Customer").split(" ")[0];

  return (
    <AdminShell>
      <div style={{ padding: "2rem 1.5rem", maxWidth: "1100px" }}>
        {/* Back */}
        <Link href="/admin/orders" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#6b6b80", fontSize: "0.85rem", textDecoration: "none", marginBottom: "1.25rem" }}>
          <ArrowLeft size={15} /> All orders
        </Link>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <h1 style={{ color: "#f5f6fa", fontSize: "1.5rem", fontWeight: 800, margin: 0, fontFamily: "monospace" }}>
                {order.ref || order.id.slice(0, 8).toUpperCase()}
              </h1>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.75rem", borderRadius: "9999px", background: st.bg, color: st.color, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em" }}>
                <StatusIcon size={13} /> {order.status}
              </span>
            </div>
            <p style={{ color: "#6b6b80", fontSize: "0.85rem", margin: "0.35rem 0 0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={13} style={{ opacity: 0.6 }} /> {fmtDate(order.created_at)}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
          {/* ── LEFT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", minWidth: 0 }}>

            {/* Order lines */}
            <div style={{ background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #ffffff0d", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Package2 size={16} color="#3b82f6" />
                <h2 style={{ color: "#f5f6fa", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>Order Items</h2>
              </div>
              {lines.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#6b6b80", fontSize: "0.875rem" }}>No line items recorded.</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0d0d18" }}>
                      {["ITEM", "QTY", "UNIT", "AMOUNT"].map(h => (
                        <th key={h} style={{ padding: "0.7rem 1.25rem", textAlign: h === "AMOUNT" ? "right" : "left", color: "#6b6b80", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line: any, i: number) => {
                      const name = line.product_name || line.name || line.slug || "Unknown item";
                      const qty  = Number(line.qty ?? line.quantity ?? 1);
                      const unit = Number(line.unit_price ?? line.price ?? 0);
                      return (
                        <tr key={i} style={{ borderTop: "1px solid #ffffff0d" }}>
                          <td style={{ padding: "1rem 1.25rem", color: "#f5f6fa", fontSize: "0.9rem", fontWeight: 600 }}>{name}</td>
                          <td style={{ padding: "1rem 1.25rem", color: "#a1a1b5" }}>{qty}</td>
                          <td style={{ padding: "1rem 1.25rem", color: "#a1a1b5" }}>{formatUSD(unit)}</td>
                          <td style={{ padding: "1rem 1.25rem", color: "#f5f6fa", fontWeight: 700, textAlign: "right" }}>{formatUSD(unit * qty)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              {/* Totals */}
              <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #ffffff14" }}>
                {[
                  { label: "Subtotal",  value: formatUSD(Number(order.subtotal_eur)) },
                  { label: "Shipping",  value: Number(order.shipping_eur) === 0 ? "FREE" : formatUSD(Number(order.shipping_eur)) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ color: "#6b6b80", fontSize: "0.85rem" }}>{label}</span>
                    <span style={{ color: "#a1a1b5", fontSize: "0.85rem" }}>{value}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ffffff14", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                  <span style={{ color: "#f5f6fa", fontSize: "1rem", fontWeight: 800 }}>Total</span>
                  <span style={{ color: "#fbbf24", fontSize: "1.25rem", fontWeight: 800 }}>{formatUSD(Number(order.total_eur))}</span>
                </div>
              </div>
            </div>

            {/* Shipping / customer */}
            <div style={{ background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <MapPin size={15} color="#3b82f6" />
                  <h3 style={{ color: "#f5f6fa", fontSize: "0.85rem", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Ship To</h3>
                </div>
                <div style={{ color: "#a1a1b5", fontSize: "0.875rem", lineHeight: 1.7 }}>
                  <div style={{ color: "#f5f6fa", fontWeight: 600 }}>{order.customer_name}</div>
                  {order.company && <div>{order.company}</div>}
                  {addr.line1 && <div>{addr.line1}</div>}
                  {addr.line2 && <div>{addr.line2}</div>}
                  {(addr.city || addr.state || addr.zip) && <div>{[addr.city, addr.state, addr.zip].filter(Boolean).join(", ")}</div>}
                  {addr.country && <div>{addr.country}</div>}
                  {order.phone && <div style={{ marginTop: "0.4rem" }}>📞 {order.phone}</div>}
                  {order.delivery_instructions && (
                    <div style={{ marginTop: "0.5rem", padding: "0.5rem 0.75rem", background: "#ffffff06", borderRadius: "0.5rem", fontSize: "0.8rem", fontStyle: "italic" }}>
                      📝 {order.delivery_instructions}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <CreditCard size={15} color="#7c3aed" />
                  <h3 style={{ color: "#f5f6fa", fontSize: "0.85rem", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Customer</h3>
                </div>
                <div style={{ color: "#a1a1b5", fontSize: "0.875rem", lineHeight: 1.7 }}>
                  <div style={{ color: "#f5f6fa", fontWeight: 600 }}>{order.email}</div>
                  <div>Payment: <span style={{ color: "#f5f6fa" }}>{order.payment_method}</span></div>
                  {order.payment_network && <div>Network: <span style={{ color: "#f5f6fa" }}>{order.payment_network}</span></div>}
                  <div>Currency: <span style={{ color: "#f5f6fa" }}>{order.currency || "USD"}</span></div>
                  {order.order_notes && <div style={{ marginTop: "0.4rem", fontStyle: "italic", color: "#6b6b80" }}>Note: {order.order_notes}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Status */}
            <div style={{ background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", padding: "1.25rem" }}>
              <h3 style={{ color: "#f5f6fa", fontSize: "0.85rem", fontWeight: 700, margin: "0 0 0.875rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Order Status</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {STATUS_OPTIONS.map(s => {
                  const active = order.status === s;
                  const sStyle = STATUS_STYLE[s];
                  return (
                    <button key={s} onClick={() => updateStatus(s)} disabled={statusLoading || active}
                      style={{ flex: 1, padding: "0.55rem 0.5rem", borderRadius: "0.625rem", border: "1px solid", borderColor: active ? sStyle.color + "50" : "#ffffff14", background: active ? sStyle.bg : "transparent", color: active ? sStyle.color : "#6b6b80", fontSize: "0.72rem", fontWeight: 700, cursor: active ? "default" : "pointer", transition: "all 0.15s" }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment email */}
            <div style={{ background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <Mail size={15} color="#fbbf24" />
                <h3 style={{ color: "#f5f6fa", fontSize: "0.85rem", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Payment Request Email</h3>
              </div>
              <p style={{ color: "#6b6b80", fontSize: "0.78rem", margin: "0 0 0.875rem", lineHeight: 1.5 }}>
                Sent to <span style={{ color: "#3b82f6" }}>{order.email}</span> with the full order summary.
              </p>
              <textarea
                rows={7}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder={`Payment method: Revolut\nAmount due: ${formatUSD(Number(order.total_eur))}\nReference: ${order.ref || order.id.slice(0,8).toUpperCase()}\n\nAccount name: RareDexCards\nRevTag: @raredexpay`}
                style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.02)", border: "1px solid #ffffff14", borderRadius: "0.75rem", padding: "0.75rem", color: "#f5f6fa", fontSize: "0.82rem", fontFamily: "monospace", resize: "vertical", outline: "none", lineHeight: 1.6 }}
                onFocus={e => (e.target.style.borderColor = "#fbbf24")}
                onBlur={e => (e.target.style.borderColor = "#ffffff14")}
              />
              {order.payment_email_sent_at && (
                <p style={{ color: "#10b981", fontSize: "0.78rem", margin: "0.5rem 0 0", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <CheckCircle2 size={12} /> Last sent: {fmtDate(order.payment_email_sent_at)}
                </p>
              )}
              {emailError && <p style={{ color: "#fca5a5", fontSize: "0.78rem", margin: "0.5rem 0 0" }}>{emailError}</p>}
              {emailSent  && <p style={{ color: "#10b981",  fontSize: "0.78rem", margin: "0.5rem 0 0" }}>✅ Email sent successfully!</p>}
              <button
                onClick={sendPaymentEmail} disabled={emailSending}
                style={{ marginTop: "0.875rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: emailSending ? "#78350f" : "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#000", border: "none", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.875rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 20px #fbbf2440", transition: "all 0.2s" }}>
                <Send size={15} /> {emailSending ? "Sending…" : "Send Payment Email"}
              </button>
            </div>

            {/* Invoice */}
            <div style={{ background: "linear-gradient(180deg,#16161f 0%,#101018 100%)", border: "1px solid #ffffff0d", borderRadius: "1rem", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <FileText size={15} color="#7c3aed" />
                <h3 style={{ color: "#f5f6fa", fontSize: "0.85rem", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Invoice</h3>
              </div>
              <p style={{ color: "#6b6b80", fontSize: "0.78rem", margin: "0 0 0.875rem", lineHeight: 1.5 }}>
                Preview and save as PDF. Shows PAID once the order is marked paid.
              </p>
              <Link href={`/admin/orders/${orderId}/invoice`} target="_blank"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "0.75rem", padding: "0.7rem", color: "#a78bfa", fontSize: "0.875rem", fontWeight: 700, textDecoration: "none", transition: "all 0.15s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,58,237,0.25)")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,58,237,0.15)")}>
                <FileText size={15} /> Preview Invoice
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            div[style*="grid-template-columns: 1fr 340px"] { grid-template-columns: 1fr !important; }
            div[style*="grid-template-columns: 1fr 1fr"]   { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </AdminShell>
  );
}
