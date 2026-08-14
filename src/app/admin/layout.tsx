import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — RareDexCards",
  description: "RareDexCards internal admin panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
