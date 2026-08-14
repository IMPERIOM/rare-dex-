import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const { proofUploaded } = await request.json();

    const result = await dbQuery(
      "UPDATE orders SET proof_uploaded = $1 WHERE ref = $2 RETURNING *",
      [!!proofUploaded, ref]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: result.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update proof." }, { status: 500 });
  }
}
