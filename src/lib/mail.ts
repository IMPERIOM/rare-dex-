import nodemailer from "nodemailer";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const host  = process.env.SMTP_HOST;
  const port  = parseInt(process.env.SMTP_PORT  || "465", 10);
  const secure = process.env.SMTP_SECURE === "true";
  const user  = process.env.SMTP_USER;
  const pass  = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[mail] SMTP not configured — emails will be printed to console only.");
    return null;
  }
  transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  return transporter;
}

export async function sendEmail({ to, subject, html, text }: EmailPayload) {
  const t    = getTransporter();
  const from = process.env.EMAIL_FROM || `"RareDexCards" <info@raredexcards.com>`;

  if (!t) {
    console.log("\n─── MOCK EMAIL ──────────────────────────────────────────");
    console.log(`FROM: ${from}\nTO: ${to}\nSUBJECT: ${subject}`);
    console.log("──────────────────────────────────────────────────────\n");
    return { messageId: "mock-" + Date.now() };
  }
  try {
    const info = await t.sendMail({ from, to, subject, html, text });
    console.log(`[mail] Sent → ${to} | id=${info.messageId}`);
    return info;
  } catch (err: any) {
    console.error("[mail] Send failed:", err.message);
    throw err;
  }
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function fmtUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

/**
 * Build a simple items HTML table row.
 * Accepts lines in any of the two common shapes:
 *   { product_name, qty, unit_price }   ← DB shape
 *   { name, quantity, price }           ← legacy shape
 */
function lineRows(lines: any[]): string {
  return lines
    .map((l) => {
      const name = l.product_name || l.name || "Item";
      const qty  = Number(l.qty ?? l.quantity ?? 1);
      const unit = Number(l.unit_price ?? l.price ?? 0);
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#1a1a1a">${name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;text-align:center">${qty}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#1a1a1a;text-align:right;font-weight:600">${fmtUSD(unit * qty)}</td>
        </tr>`;
    })
    .join("");
}

const WRAPPER_START = `
<div style="background:#f9fafb;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
`;
const WRAPPER_END = `
<div style="padding:20px 24px;background:#f3f4f6;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center">
  <p style="margin:0">© ${new Date().getFullYear()} RareDexCards · <a href="mailto:info@raredexcards.com" style="color:#6b7280">info@raredexcards.com</a></p>
  <p style="margin:4px 0 0">RareDexCards is an independent wholesale distributor not affiliated with The Pokémon Company.</p>
</div>
</div></div>
`;

// ─── Customer confirmation ──────────────────────────────────────────────────────

export function getOrderConfirmationHtml(order: {
  ref: string;
  customer_name: string;
  email: string;
  payment_method: string;
  subtotal_eur: number;
  shipping_eur: number;
  total_eur: number;
  lines: any[];
  shipping_address?: any;
}) {
  const addr = order.shipping_address
    ? (typeof order.shipping_address === "string" ? JSON.parse(order.shipping_address) : order.shipping_address)
    : {};
  const addrStr = [addr.line1, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(", ");

  return `${WRAPPER_START}
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%);padding:28px 24px">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.01em">✅ Order Confirmed</h1>
    <p style="margin:6px 0 0;color:#bfdbfe;font-size:14px">RareDexCards — Wholesale</p>
  </div>

  <!-- Body -->
  <div style="padding:28px 24px">
    <p style="font-size:15px;color:#374151;margin:0 0 6px">Hello <strong>${order.customer_name}</strong>,</p>
    <p style="font-size:14px;color:#6b7280;margin:0 0 20px">Thank you for your order! We've reserved your inventory and are now awaiting payment. Your order reference is below.</p>

    <!-- Order meta -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:#374151"><strong>Order Ref:</strong> <span style="color:#1d4ed8;font-weight:800;font-family:monospace">${order.ref}</span></p>
      <p style="margin:6px 0 0;font-size:13px;color:#374151"><strong>Payment Method:</strong> ${order.payment_method}</p>
      ${addrStr ? `<p style="margin:6px 0 0;font-size:13px;color:#374151"><strong>Ship To:</strong> ${addrStr}</p>` : ""}
    </div>

    <!-- Items table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
      <thead>
        <tr style="background:#f3f4f6">
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af">Item</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af">Qty</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af">Total</th>
        </tr>
      </thead>
      <tbody>${lineRows(order.lines)}</tbody>
    </table>

    <!-- Totals -->
    <div style="text-align:right;padding:12px 0;border-top:2px solid #e5e7eb">
      <p style="margin:0;font-size:13px;color:#6b7280">Subtotal: ${fmtUSD(Number(order.subtotal_eur))}</p>
      <p style="margin:4px 0;font-size:13px;color:#6b7280">Shipping: ${Number(order.shipping_eur) === 0 ? "FREE" : fmtUSD(Number(order.shipping_eur))}</p>
      <p style="margin:8px 0 0;font-size:18px;font-weight:800;color:#1a1a1a">Total: ${fmtUSD(Number(order.total_eur))}</p>
    </div>

    <!-- Next steps -->
    <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-top:20px">
      <p style="margin:0;font-size:13px;color:#92400e;font-weight:700">⚡ Next Step — Complete Your Payment</p>
      <p style="margin:8px 0 0;font-size:13px;color:#78350f">We will send you a separate email with your exact payment instructions shortly. Please complete payment using the method you selected to get your order shipped fast.</p>
    </div>

    <p style="font-size:13px;color:#6b7280;margin-top:20px">Questions? Email us at <a href="mailto:info@raredexcards.com" style="color:#1d4ed8">info@raredexcards.com</a></p>
  </div>
${WRAPPER_END}`;
}

// ─── Admin new-order alert ──────────────────────────────────────────────────────

export function getAdminOrderAlertHtml(order: {
  ref: string;
  customer_name: string;
  email: string;
  phone?: string;
  payment_method: string;
  subtotal_eur: number;
  shipping_eur: number;
  total_eur: number;
  lines: any[];
  shipping_address?: any;
  order_notes?: string;
}) {
  const addr = order.shipping_address
    ? (typeof order.shipping_address === "string" ? JSON.parse(order.shipping_address) : order.shipping_address)
    : {};
  const addrStr = [addr.line1, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(", ");

  return `${WRAPPER_START}
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:28px 24px">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:800">🛒 New Order Received!</h1>
    <p style="margin:6px 0 0;color:#fecaca;font-size:14px">RareDexCards Admin Alert</p>
  </div>

  <!-- Body -->
  <div style="padding:28px 24px">
    <!-- Order meta -->
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="margin:0;font-size:14px;color:#1a1a1a"><strong>Order Ref:</strong> <span style="color:#dc2626;font-weight:800;font-family:monospace">${order.ref}</span></p>
      <p style="margin:6px 0 0;font-size:13px;color:#374151"><strong>Customer:</strong> ${order.customer_name}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#374151"><strong>Email:</strong> <a href="mailto:${order.email}" style="color:#1d4ed8">${order.email}</a></p>
      ${order.phone ? `<p style="margin:4px 0 0;font-size:13px;color:#374151"><strong>Phone:</strong> ${order.phone}</p>` : ""}
      <p style="margin:4px 0 0;font-size:13px;color:#374151"><strong>Payment:</strong> ${order.payment_method}</p>
      ${addrStr ? `<p style="margin:4px 0 0;font-size:13px;color:#374151"><strong>Ship To:</strong> ${addrStr}</p>` : ""}
    </div>

    <!-- Items table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
      <thead>
        <tr style="background:#f3f4f6">
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af">Item</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af">Qty</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af">Total</th>
        </tr>
      </thead>
      <tbody>${lineRows(order.lines)}</tbody>
    </table>

    <!-- Totals -->
    <div style="text-align:right;padding:12px 0;border-top:2px solid #e5e7eb">
      <p style="margin:0;font-size:13px;color:#6b7280">Subtotal: ${fmtUSD(Number(order.subtotal_eur))}</p>
      <p style="margin:4px 0;font-size:13px;color:#6b7280">Shipping: ${Number(order.shipping_eur) === 0 ? "FREE" : fmtUSD(Number(order.shipping_eur))}</p>
      <p style="margin:8px 0 0;font-size:18px;font-weight:800;color:#dc2626">Total: ${fmtUSD(Number(order.total_eur))}</p>
    </div>

    ${order.order_notes ? `<div style="margin-top:16px;padding:12px;background:#f9fafb;border-radius:8px;font-size:13px;color:#374151"><strong>Order notes:</strong> ${order.order_notes}</div>` : ""}

    <!-- CTA -->
    <div style="margin-top:24px;text-align:center">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://raredexcards.com"}/admin/orders"
         style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px">
        View in Admin Panel →
      </a>
    </div>
  </div>
${WRAPPER_END}`;
}

// ─── Payment request ────────────────────────────────────────────────────────────

export function getPaymentRequestHtml(order: any, customInstructions: string) {
  const lines: any[] = Array.isArray(order.lines) ? order.lines
    : Array.isArray(order.items) ? order.items.map((it: any) => ({
        product_name: it.name,
        qty: it.quantity,
        unit_price: it.price,
      }))
    : [];

  return `${WRAPPER_START}
  <div style="background:linear-gradient(135deg,#78350f 0%,#d97706 100%);padding:28px 24px">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:800">💳 Payment Instructions</h1>
    <p style="margin:6px 0 0;color:#fef3c7;font-size:14px">RareDexCards — Wholesale</p>
  </div>
  <div style="padding:28px 24px">
    <p style="font-size:15px;color:#374151;margin:0 0 6px">Hello <strong>${order.customer_name || order.customer_first_name || "Customer"}</strong>,</p>
    <p style="font-size:14px;color:#6b7280;margin:0 0 20px">Here are your payment instructions for order <strong style="color:#1a1a1a">${order.ref}</strong>. Please complete payment as soon as possible to avoid delays.</p>

    <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:20px;margin-bottom:20px;font-family:monospace;font-size:13px;color:#374151;white-space:pre-wrap">${customInstructions}</div>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px">
      <p style="margin:0;font-size:14px;font-weight:700;color:#166534">Amount Due: ${fmtUSD(Number(order.total_eur || order.total))}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#166534">Reference: <strong>${order.ref}</strong></p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
      <thead><tr style="background:#f3f4f6">
        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af">Item</th>
        <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af">Qty</th>
        <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af">Total</th>
      </tr></thead>
      <tbody>${lineRows(lines)}</tbody>
    </table>
    <div style="text-align:right;padding-top:12px;border-top:2px solid #e5e7eb">
      <p style="margin:0;font-size:16px;font-weight:800;color:#1a1a1a">Total: ${fmtUSD(Number(order.total_eur || order.total))}</p>
    </div>

    <p style="font-size:13px;color:#6b7280;margin-top:20px">After paying, reply to this email with your transaction receipt so we can verify and ship promptly. Questions? <a href="mailto:info@raredexcards.com" style="color:#1d4ed8">info@raredexcards.com</a></p>
  </div>
${WRAPPER_END}`;
}

// ─── Status update ──────────────────────────────────────────────────────────────

export function getOrderStatusUpdateHtml(order: any) {
  const status = (order.status || "PENDING").toUpperCase();
  const color  = status === "PAID" ? "#16a34a" : status === "CANCELED" ? "#dc2626" : "#1d4ed8";
  const msg    = status === "PAID"
    ? "Your payment has been verified! We're preparing your shipment and will send a tracking number soon."
    : status === "CANCELED"
    ? "Your order has been canceled. Please contact us if this was unexpected."
    : "Your order is pending payment. We'll notify you as soon as it's confirmed.";

  const firstName = order.customer_name
    ? order.customer_name.split(" ")[0]
    : (order.customer_first_name || "Customer");

  return `${WRAPPER_START}
  <div style="background:${color};padding:28px 24px">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:800">Order Update — ${status}</h1>
    <p style="margin:6px 0 0;color:#fff;opacity:.8;font-size:14px">RareDexCards — Wholesale</p>
  </div>
  <div style="padding:28px 24px">
    <p style="font-size:15px;color:#374151;margin:0 0 6px">Hello <strong>${firstName}</strong>,</p>
    <p style="font-size:14px;color:#6b7280;margin:0 0 20px">The status of your order <strong style="color:#1a1a1a">${order.ref}</strong> has been updated to:</p>
    <div style="text-align:center;padding:24px;background:#f9fafb;border-radius:8px;border:2px solid ${color}20;margin-bottom:20px">
      <span style="font-size:28px;font-weight:800;color:${color};letter-spacing:-0.02em">${status}</span>
    </div>
    <p style="font-size:14px;color:#374151">${msg}</p>
    <p style="font-size:13px;color:#6b7280;margin-top:20px">Questions? <a href="mailto:info@raredexcards.com" style="color:#1d4ed8">info@raredexcards.com</a></p>
  </div>
${WRAPPER_END}`;
}
