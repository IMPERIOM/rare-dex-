import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminDashboardClient } from "./DashboardClient";

export default async function AdminDashboardPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  return <AdminDashboardClient />;
}
