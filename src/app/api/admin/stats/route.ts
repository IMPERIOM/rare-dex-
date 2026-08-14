import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { dbQuery } from "@/lib/db";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [pending, paid, canceled, orders7d, revenue7d, recentOrders, topProducts] =
      await Promise.all([
        dbQuery("SELECT COUNT(*) as count, COALESCE(SUM(total_eur), 0) as value FROM orders WHERE status = 'PENDING'"),
        dbQuery("SELECT COUNT(*) as count, COALESCE(SUM(total_eur), 0) as value FROM orders WHERE status = 'PAID'"),
        dbQuery("SELECT COUNT(*) as count FROM orders WHERE status = 'CANCELED'"),
        dbQuery("SELECT COUNT(*) as count FROM orders WHERE created_at >= NOW() - INTERVAL '7 days'"),
        dbQuery("SELECT COALESCE(SUM(total_eur), 0) as value FROM orders WHERE status = 'PAID' AND created_at >= NOW() - INTERVAL '7 days'"),
        dbQuery("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5"),
        dbQuery(`
          SELECT line->>'product_name' as name, SUM((line->>'qty')::int) as total_qty
          FROM orders, jsonb_array_elements(lines) as line
          WHERE status != 'CANCELED'
            AND line->>'product_name' IS NOT NULL
            AND line->>'qty' ~ '^[0-9]+$'
          GROUP BY line->>'product_name'
          ORDER BY total_qty DESC
          LIMIT 5
        `).catch(() => ({ rows: [] })),
      ]);

    return NextResponse.json({
      pending: {
        count: parseInt(pending.rows[0].count, 10),
        value: parseFloat(pending.rows[0].value),
      },
      paid: {
        count: parseInt(paid.rows[0].count, 10),
        value: parseFloat(paid.rows[0].value),
      },
      canceled: {
        count: parseInt(canceled.rows[0].count, 10),
      },
      last7Days: {
        count: parseInt(orders7d.rows[0].count, 10),
        revenue: parseFloat(revenue7d.rows[0].value),
      },
      recentOrders: recentOrders.rows,
      topProducts: topProducts.rows,
    });
  } catch (err: any) {
    console.error("GET admin stats error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
