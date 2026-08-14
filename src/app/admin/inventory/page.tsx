import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminInventoryClient } from "./InventoryClient";

export default async function AdminInventoryPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");
  return <AdminInventoryClient />;
}
