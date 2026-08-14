import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { sendEmail, getOrderConfirmationHtml, getAdminOrderAlertHtml } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const {
      email,
      customer_name,
      phone,
      company,
      shipping_address,
      delivery_instructions,
      order_notes,
      payment_method,
      payment_network,
      subtotal,
      shipping,
      total,
      currency,
      locale,
      newsletter_opt_in,
      lines
    } = body;

    if (!email || !customer_name || !shipping_address || !lines || lines.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique order reference: RDX-XXXXXX
    const ref = "RDX-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    // 1. Save to Database
    const result = await dbQuery(
      `INSERT INTO orders (
        ref, status, email, customer_name, phone, company,
        shipping_address, delivery_instructions, order_notes,
        payment_method, payment_network,
        subtotal_eur, shipping_eur, total_eur, currency, locale,
        newsletter_opt_in, lines
      ) VALUES (
        $1, 'PENDING', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *`,
      [
        ref,
        email,
        customer_name,
        phone || "",
        company || null,
        JSON.stringify(shipping_address),
        delivery_instructions || null,
        order_notes || null,
        payment_method,
        payment_network || null,
        subtotal,
        shipping,
        total,
        currency || "USD",
        locale || "en",
        !!newsletter_opt_in,
        JSON.stringify(lines)
      ]
    );

    const order = result.rows[0];

    // 2. Decrement inventory stock
    for (const item of lines) {
      const productId = item.productId || item.id;
      const qty = parseInt(item.qty || item.quantity || 1, 10);
      if (productId) {
        try {
          await dbQuery(
            `UPDATE products_inventory 
             SET stock = GREATEST(0, stock - $1),
                 availability = CASE WHEN stock - $1 <= 0 THEN 'out-of-stock' ELSE availability END
             WHERE id = $2`,
            [qty, productId]
          );
        } catch (invErr) {
          console.error(`Failed to update stock for product ${productId}:`, invErr);
        }
      }
    }

    // 3. Send Customer Order Confirmation Email
    try {
      const customerHtml = getOrderConfirmationHtml({
        ref: order.ref,
        customer_name: order.customer_name,
        email: order.email,
        payment_method: order.payment_method,
        subtotal_eur: Number(order.subtotal_eur),
        shipping_eur: Number(order.shipping_eur),
        total_eur: Number(order.total_eur),
        lines: lines,
        shipping_address: order.shipping_address
      });

      await sendEmail({
        to: order.email,
        subject: `RareDexCards — Order Confirmed: ${order.ref}`,
        html: customerHtml
      });
    } catch (mailErr: any) {
      console.error("Failed to send customer confirmation email:", mailErr.message);
    }

    // 4. Send Admin Notification Email
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "info@raredexcards.com";
      const adminHtml = getAdminOrderAlertHtml({
        ref: order.ref,
        customer_name: order.customer_name,
        email: order.email,
        phone: order.phone,
        payment_method: order.payment_method,
        subtotal_eur: Number(order.subtotal_eur),
        shipping_eur: Number(order.shipping_eur),
        total_eur: Number(order.total_eur),
        lines: lines,
        shipping_address: order.shipping_address,
        order_notes: order.order_notes
      });

      await sendEmail({
        to: adminEmail,
        subject: `[New Order] ${order.ref} — ${order.customer_name} (${formatUSD(Number(order.total_eur))})`,
        html: adminHtml
      });
    } catch (mailErr: any) {
      console.error("Failed to send admin notification email:", mailErr.message);
    }

    return NextResponse.json({ success: true, ref: order.ref, id: order.id }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json({ error: err.message || "Failed to place order." }, { status: 500 });
  }
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}
