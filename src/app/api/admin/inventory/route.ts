import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { dbQuery } from "@/lib/db";

// GET /api/admin/inventory
export async function GET(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  let queryText = "SELECT * FROM products_inventory";
  const params: any[] = [];

  if (q) {
    params.push(`%${q}%`);
    queryText += ` WHERE name ILIKE $1 OR sku ILIKE $1`;
  }
  queryText += " ORDER BY name ASC";

  try {
    const result = await dbQuery(queryText, params);
    return NextResponse.json({ inventory: result.rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/admin/inventory — bulk update stock/price/availability
export async function PATCH(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, stock, price, availability } = await request.json();

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const fields: string[] = [];
  const values: any[] = [];

  if (stock !== undefined) { values.push(stock); fields.push(`stock = $${values.length}`); }
  if (price !== undefined) { values.push(price); fields.push(`price = $${values.length}`); }
  if (availability !== undefined) { values.push(availability); fields.push(`availability = $${values.length}`); }
  values.push(new Date().toISOString()); fields.push(`updated_at = $${values.length}`);
  values.push(id);

  try {
    const result = await dbQuery(
      `UPDATE products_inventory SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: result.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
