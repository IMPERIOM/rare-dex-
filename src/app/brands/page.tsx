import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { products } from "@/lib/products";
import { RevealGroup, RevealItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Brands & Product Lines",
  description:
    "Browse wholesale Pokémon TCG product by line and era — Scarlet & Violet, Sword & Shield, Japanese imports, graded, and supplies.",
};

const BRAND_GRAD: Record<string, string> = {
  "Scarlet & Violet": "from-royal to-violet",
  "Sword & Shield": "from-blue-700 to-cyan-500",
  Japanese: "from-fuchsia-700 to-pink-500",
  Graded: "from-amber-600 to-gold",
  Mixed: "from-slate-700 to-slate-500",
  Supplies: "from-teal-700 to-emerald-500",
};

export default function BrandsPage() {
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const countFor = (b: string) => products.filter((p) => p.brand === b).length;

  return (
    <>
      <PageHero
        eyebrow="Brands"
        title="Brands & Product Lines"
        subtitle="We stock authentic product across the major eras and origins. Filter the catalog by any line to see wholesale availability."
      />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <RevealItem key={b}>
              <Link
                href="/shop"
                className={`holo group relative flex h-40 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] border border-line bg-gradient-to-br ${BRAND_GRAD[b] ?? "from-slate-700 to-slate-500"} p-5`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="relative flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-ink">{b}</p>
                    <p className="text-xs text-muted">{countFor(b)} wholesale lines</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-royal transition group-hover:translate-x-1" />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
