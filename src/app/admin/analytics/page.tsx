import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminAnalyticsClient } from "./AnalyticsClient";

export default async function AdminAnalyticsPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");
  return <AdminAnalyticsClient />;
}
