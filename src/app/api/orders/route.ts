import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { sendEmail, getOrderConfirmationHtml, getAdminOrderAlertHtml } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
      lines,
    } = body;

    if (!email || !customer_name || !shipping_address || !lines || lines.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique order reference
    const ref = "RDX-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    // 1. Save order to database
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
        JSON.stringify(shipping_address || {}),
        delivery_instructions || null,
        order_notes || null,
        payment_method || "Unknown",
        payment_network || null,
        subtotal || 0,
        shipping || 0,
        total || 0,
        currency || "USD",
        locale || "en",
        newsletter_opt_in || false,
        JSON.stringify(lines || []),
      ]
    );

    const order = result.rows[0];

    // 2. Decrement inventory stock atomically
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
          console.error(`Stock update failed for ${productId}:`, invErr);
        }
      }
    }

    // 3. Customer Confirmation Email
    try {
      await sendEmail({
        to: order.email,
        subject: `RareDexCards — Order Confirmed: ${order.ref}`,
        html: getOrderConfirmationHtml({
          ref: order.ref,
          customer_name: order.customer_name,
          email: order.email,
          payment_method: order.payment_method,
          subtotal_eur: Number(order.subtotal_eur),
          shipping_eur: Number(order.shipping_eur),
          total_eur: Number(order.total_eur),
          lines: typeof order.lines === "string" ? JSON.parse(order.lines) : order.lines,
          shipping_address: typeof order.shipping_address === "string"
            ? JSON.parse(order.shipping_address)
            : order.shipping_address,
        }),
      });
    } catch (e: any) {
      console.error("Customer confirmation email failed:", e.message);
    }

    // 4. Admin Alert Email
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "info@raredexcards.com";
      await sendEmail({
        to: adminEmail,
        subject: `[New Order] ${order.ref} — ${order.customer_name}`,
        html: getAdminOrderAlertHtml({
          ref: order.ref,
          customer_name: order.customer_name,
          email: order.email,
          phone: order.phone,
          payment_method: order.payment_method,
          subtotal_eur: Number(order.subtotal_eur),
          shipping_eur: Number(order.shipping_eur),
          total_eur: Number(order.total_eur),
          lines: typeof order.lines === "string" ? JSON.parse(order.lines) : order.lines,
          shipping_address: typeof order.shipping_address === "string"
            ? JSON.parse(order.shipping_address)
            : order.shipping_address,
          order_notes: order.order_notes,
        }),
      });
    } catch (e: any) {
      console.error("Admin alert email failed:", e.message);
    }

    return NextResponse.json(
      { success: true, ref: order.ref, id: order.id, order },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Order creation error:", err.message);
    return NextResponse.json({ error: err.message || "Failed to place order." }, { status: 500 });
  }
}
