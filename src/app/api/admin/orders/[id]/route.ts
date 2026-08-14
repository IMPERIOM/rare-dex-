import { NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/auth";
import { dbQuery } from "@/lib/db";
import { sendEmail, getOrderStatusUpdateHtml } from "@/lib/mail";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticatedFromRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const result = await dbQuery("SELECT * FROM orders WHERE id = $1", [id]);
    if (result.rows.length === 0) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order: result.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticatedFromRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();

  const allowed = ["status", "payment_details", "proof_uploaded", "proof_url", "order_notes"];
  const fields: string[] = [];
  const values: any[] = [];

  for (const key of allowed) {
    if (body[key] !== undefined) {
      values.push(body[key]);
      fields.push(`${key} = $${values.length}`);
    }
  }

  if (fields.length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  values.push(id);
  try {
    const result = await dbQuery(
      `UPDATE orders SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const order = result.rows[0];

    if (body.status) {
      try {
        await sendEmail({
          to: order.email,
          subject: `RareDexCards — Your Order ${order.ref} is now ${order.status}`,
          html: getOrderStatusUpdateHtml({
            ref: order.ref,
            customer_name: order.customer_name || "Customer",
            email: order.email,
            status: order.status,
          }),
        });
      } catch (mailErr) {
        console.error("Status email failed:", mailErr);
      }
    }
    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
