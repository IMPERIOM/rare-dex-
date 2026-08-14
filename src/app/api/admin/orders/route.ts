import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { dbQuery } from "@/lib/db";

// GET /api/admin/orders
export async function GET(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const conditions: string[] = [];
  const params: any[] = [];

  if (status && status !== "all") {
    params.push(status.toUpperCase());
    conditions.push(`status = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    const idx = params.length;
    conditions.push(`(email ILIKE $${idx} OR ref ILIKE $${idx} OR customer_name ILIKE $${idx})`);
  }

  let queryText = "SELECT * FROM orders";
  if (conditions.length > 0) queryText += " WHERE " + conditions.join(" AND ");
  queryText += " ORDER BY created_at DESC";

  try {
    const result = await dbQuery(queryText, params);
    return NextResponse.json({ orders: result.rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/orders — create order (called from checkout)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ref = "RDX-" + Math.random().toString(36).slice(2, 10).toUpperCase();

    const result = await dbQuery(
      `INSERT INTO orders (
        ref, status, email, customer_name, phone, company,
        shipping_address, delivery_instructions, order_notes,
        payment_method, payment_network,
        subtotal_eur, shipping_eur, total_eur, currency, locale,
        newsletter_opt_in, lines
      ) VALUES (
        $1,'PENDING',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
      ) RETURNING *`,
      [
        ref,
        body.email,
        body.customer_name,
        body.phone || "",
        body.company || null,
        JSON.stringify(body.shipping_address || {}),
        body.delivery_instructions || null,
        body.order_notes || null,
        body.payment_method || "Unknown",
        body.payment_network || null,
        body.subtotal || 0,
        body.shipping || 0,
        body.total || 0,
        body.currency || "USD",
        body.locale || "en",
        body.newsletter_opt_in || false,
        JSON.stringify(body.lines || []),
      ]
    );

    return NextResponse.json({ order: result.rows[0] }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
