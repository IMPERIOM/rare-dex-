import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { dbQuery } from "@/lib/db";
import { sendEmail, getPaymentRequestHtml } from "@/lib/mail";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { instructions } = await request.json();

  try {
    const orderResult = await dbQuery("SELECT * FROM orders WHERE id = $1", [id]);
    if (orderResult.rows.length === 0) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const order = orderResult.rows[0];

    // Save payment details and timestamp
    await dbQuery(
      "UPDATE orders SET payment_details = $1, payment_email_sent_at = NOW() WHERE id = $2",
      [instructions, id]
    );

    const lines = Array.isArray(order.lines)
      ? order.lines
      : (typeof order.lines === "string" ? JSON.parse(order.lines || "[]") : []);

    await sendEmail({
      to: order.email,
      subject: `RareDexCards — Payment Details for Order ${order.ref}`,
      html: getPaymentRequestHtml(
        {
          ref: order.ref,
          customer_name: order.customer_name || "Customer",
          email: order.email,
          payment_method: order.payment_method,
          total_eur: Number(order.total_eur),
          subtotal_eur: Number(order.subtotal_eur),
          shipping_eur: Number(order.shipping_eur),
          lines: lines,
        },
        instructions
      ),
    });

    return NextResponse.json({ success: true, sentAt: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
