import { NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/auth";
import { dbQuery } from "@/lib/db";

export async function GET(request: Request) {
  if (!isAdminAuthenticatedFromRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    console.error("GET admin orders error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
