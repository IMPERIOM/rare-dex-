import { Suspense } from "react";
import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = {
  title: "Wholesale Product Catalog",
  description:
    "Browse the full wholesale catalog of authentic Pokémon TCG products — sealed cases, ETBs, premium collections, graded lots, Japanese imports, accessories, and more. Dealer pricing on request.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-faint">Loading catalog…</div>}
    >
      <Catalog />
    </Suspense>
  );
}
