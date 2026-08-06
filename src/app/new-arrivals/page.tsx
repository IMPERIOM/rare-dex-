import { Suspense } from "react";
import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "New Arrivals & Pre-Orders",
  description:
    "The latest wholesale Pokémon TCG arrivals and open pre-orders. Reserve allocation on upcoming releases at dealer pricing.",
};

export default function NewArrivalsPage() {
  return (
    <>
      <PageHero
        eyebrow="Just landed"
        title="New Arrivals & Pre-Orders"
        subtitle="Freshly stocked lines and open pre-order allocations. Reserve early to secure quantity on high-demand releases."
      />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-faint">Loading new arrivals…</div>}>
        <Catalog mode="new" title="New Arrivals" />
      </Suspense>
    </>
  );
}
