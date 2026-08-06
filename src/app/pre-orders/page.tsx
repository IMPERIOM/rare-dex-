import { Suspense } from "react";
import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Pre-Orders",
  description:
    "Reserve wholesale allocation on upcoming Pokémon TCG releases. Lock in dealer quantities on pre-order product before it lands.",
};

export default function PreOrdersPage() {
  return (
    <>
      <PageHero
        eyebrow="Reserve allocation"
        title="Pre-Orders"
        subtitle="Secure dealer quantities on upcoming releases before they land. Pre-order allocation is confirmed at the time of quote."
      />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-faint">Loading pre-orders…</div>}>
        <Catalog mode="preorder" title="Pre-Order Allocation" />
      </Suspense>
    </>
  );
}
