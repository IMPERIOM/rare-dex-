import { Suspense } from "react";
import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Clearance Inventory",
  description:
    "Overstock and closeout Pokémon TCG wholesale inventory at reduced dealer pricing. Authentic product, while stock lasts.",
};

export default function ClearancePage() {
  return (
    <>
      <PageHero
        eyebrow="Closeouts"
        title="Clearance Inventory"
        subtitle="Overstock and end-of-line wholesale lots at reduced dealer pricing — fully authentic sealed product and accessories, while stock lasts."
      />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-faint">Loading clearance…</div>}>
        <Catalog mode="clearance" title="Clearance Lots" />
      </Suspense>
    </>
  );
}
