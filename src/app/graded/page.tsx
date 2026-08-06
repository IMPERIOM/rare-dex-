import { Suspense } from "react";
import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Graded Cards — PSA, BGS & CGC Dealer Lots",
  description:
    "Wholesale graded Pokémon card lots from PSA, BGS, and CGC. Verifiable certification numbers and full manifests. Dealer pricing on request.",
};

export default function GradedPage() {
  return (
    <>
      <PageHero
        eyebrow="Graded"
        title="Graded Card Dealer Lots"
        subtitle="Authenticated PSA, BGS, and CGC slabs sold in dealer lots. Every certification number is verifiable and a full manifest is provided on quote."
      />
      <Suspense
        fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-faint">Loading graded cards…</div>}
      >
        <Catalog mode="graded" title="Graded Card Lots" />
      </Suspense>
    </>
  );
}
