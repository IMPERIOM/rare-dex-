import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { dbQuery } from "@/lib/db";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const { id } = await params;
  const result = await dbQuery("SELECT * FROM orders WHERE id = $1", [id]);
  if (result.rows.length === 0) redirect("/admin/orders");

  const order = result.rows[0];

  function parseLines(raw: any): any[] {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw || "[]"); } catch { return []; }
  }
  function parseAddr(raw: any): Record<string, string> {
    if (!raw) return {};
    if (typeof raw === "object") return raw;
    try { return JSON.parse(raw); } catch { return {}; }
  }

  const lines = parseLines(order.lines);
  const addr  = parseAddr(order.shipping_address);

  function fmtUSD(n: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  }
  function fmtDate(s: string) {
    return new Date(s).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
  }

  const ref = order.ref || order.id.slice(0, 8).toUpperCase();

  return (
    <html lang="en">
      <head>
        <title>Invoice {ref} — RareDexCards</title>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#fff; color:#1a1a1a; padding:2.5cm; }
          @media print { body { padding: 0; } }
          .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2.5rem; }
          .brand { font-size:1.5rem; font-weight:800; }
          .brand span { color:#3b82f6; }
          .invoice-meta { text-align:right; }
          .invoice-meta h1 { font-size:2rem; font-weight:800; color:#3b82f6; letter-spacing:-0.03em; }
          .badge { display:inline-block; padding:0.3rem 0.75rem; border-radius:9999px; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; margin-top:0.5rem; }
          .PAID     { background:#d1fae5; color:#065f46; }
          .PENDING  { background:#fef3c7; color:#92400e; }
          .CANCELED { background:#fee2e2; color:#991b1b; }
          .divider { border:none; border-top:2px solid #e5e7eb; margin:1.5rem 0; }
          .two-col { display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-bottom:2rem; }
          .section-title { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#9ca3af; margin-bottom:0.5rem; }
          .address { font-size:0.9rem; line-height:1.7; color:#374151; }
          table { width:100%; border-collapse:collapse; font-size:0.875rem; margin-bottom:1rem; }
          thead tr { border-bottom:2px solid #e5e7eb; }
          thead th { padding:0.625rem 0.75rem; text-align:left; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#9ca3af; }
          tbody td { padding:0.75rem 0.75rem; border-bottom:1px solid #f3f4f6; color:#374151; }
          .totals { margin-left:auto; width:260px; margin-top:0.5rem; }
          .totals-row { display:flex; justify-content:space-between; padding:0.375rem 0; font-size:0.875rem; color:#6b7280; }
          .totals-total { display:flex; justify-content:space-between; padding:0.625rem 0; border-top:2px solid #1a1a1a; margin-top:0.5rem; font-weight:800; font-size:1.125rem; }
          .pay-block { background:#f9fafb; border:1px solid #e5e7eb; border-radius:0.5rem; padding:1rem; font-family:monospace; font-size:0.82rem; white-space:pre-wrap; color:#374151; margin-top:0.5rem; }
          .footer { margin-top:3rem; font-size:0.75rem; color:#9ca3af; border-top:1px solid #e5e7eb; padding-top:1rem; }
          .print-btn { position:fixed; bottom:2rem; right:2rem; background:#3b82f6; color:#fff; border:none; border-radius:0.75rem; padding:0.75rem 1.5rem; font-size:0.9rem; font-weight:700; cursor:pointer; box-shadow:0 4px 20px #3b82f640; }
          @media print { .print-btn { display:none; } }
        `}</style>
      </head>
      <body>
        <div className="header">
          <div>
            <div className="brand">Rare<span>Dex</span>Cards</div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>raredexcards.com</div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>info@raredexcards.com</div>
          </div>
          <div className="invoice-meta">
            <h1>INVOICE</h1>
            <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1rem", color: "#374151" }}>{ref}</div>
            <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "0.25rem" }}>Date: {fmtDate(order.created_at)}</div>
            <div className={`badge ${order.status}`}>{order.status}</div>
          </div>
        </div>

        <hr className="divider" />

        <div className="two-col">
          <div>
            <div className="section-title">Bill To / Ship To</div>
            <div className="address">
              <strong>{order.customer_name}</strong><br />
              {order.company && <>{order.company}<br /></>}
              {addr.line1 && <>{addr.line1}<br /></>}
              {addr.line2 && <>{addr.line2}<br /></>}
              {(addr.city || addr.state || addr.zip) && <>{[addr.city, addr.state, addr.zip].filter(Boolean).join(", ")}<br /></>}
              {addr.country && <>{addr.country}<br /></>}
              {order.phone && <>{order.phone}<br /></>}
              {order.email}
            </div>
          </div>
          <div>
            <div className="section-title">Payment Info</div>
            <div className="address">
              <strong>Method:</strong> {order.payment_method}<br />
              {order.payment_network && <><strong>Network:</strong> {order.payment_network}<br /></>}
              <strong>Currency:</strong> {order.currency || "USD"}<br />
              {order.payment_email_sent_at && (
                <><strong>Payment email sent:</strong> {fmtDate(order.payment_email_sent_at)}<br /></>
              )}
            </div>
          </div>
        </div>

        <div className="section-title">Items</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Unit Price</th>
              <th style={{ textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr><td colSpan={4} style={{ color: "#9ca3af", padding: "1rem 0.75rem" }}>No items recorded.</td></tr>
            ) : lines.map((line: any, i: number) => {
              const name = line.product_name || line.name || line.slug || "Item";
              const qty  = Number(line.qty ?? line.quantity ?? 1);
              const unit = Number(line.unit_price ?? line.price ?? 0);
              return (
                <tr key={i}>
                  <td>{name}</td>
                  <td style={{ textAlign: "center" }}>{qty}</td>
                  <td style={{ textAlign: "right" }}>{fmtUSD(unit)}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{fmtUSD(unit * qty)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="totals">
          <div className="totals-row"><span>Subtotal</span><span>{fmtUSD(Number(order.subtotal_eur))}</span></div>
          <div className="totals-row"><span>Shipping</span><span>{Number(order.shipping_eur) === 0 ? "FREE" : fmtUSD(Number(order.shipping_eur))}</span></div>
          <div className="totals-total"><span>Total Due</span><span>{fmtUSD(Number(order.total_eur))}</span></div>
        </div>

        {(order.payment_instructions || order.payment_details) && (
          <div style={{ marginTop: "2rem" }}>
            <div className="section-title">Payment Instructions (Last Sent)</div>
            <div className="pay-block">{order.payment_instructions || order.payment_details}</div>
          </div>
        )}

        {order.order_notes && (
          <div style={{ marginTop: "1.5rem" }}>
            <div className="section-title">Order Notes</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", fontStyle: "italic" }}>{order.order_notes}</div>
          </div>
        )}

        <div className="footer">
          <p>RareDexCards — raredexcards.com · info@raredexcards.com</p>
          <p style={{ marginTop: "0.25rem" }}>RareDexCards is an independent wholesale distributor. Not affiliated with Nintendo, Game Freak, or The Pokémon Company.</p>
        </div>

        <button className="print-btn" onClick={() => window.print()}>🖨 Print / Save PDF</button>
      </body>
    </html>
  );
}
