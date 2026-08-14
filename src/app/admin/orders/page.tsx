import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminOrdersClient } from "./OrdersClient";

export default async function AdminOrdersPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");
  return <AdminOrdersClient />;
}
