import type { Product, ProductCategory } from "./types";
import importedProducts from "@/data/imported-products.json";

// ------------------------------------------------------------------
// CATALOG
// Full inventory imported from Pokemon Plug's storefront (pokemonplug.com) —
// 198 products parsed from the store's collection feeds. A handful of
// flagship listings (see ENRICHMENTS below) got the full manual treatment:
// hand-written descriptions, real photo galleries, and verified SKU/grading
// data pulled from the product page itself rather than the generic
// collection-listing feed.
// Replaced later by the Supabase-backed catalog API; keep the shape in sync
// with `Product`.
// ------------------------------------------------------------------

type Enrichment = Partial<Product>;

const ENRICHMENTS: Record<string, Enrichment> = {
  "pitch-black-booster-box": {
    sku: "PRE-46198357000389",
    caseQty: "36 packs / box",
    art: { from: "#0f0f1a", to: "#6d28d9", emoji: "🌑" },
    image: "/products/pitch-black-booster-box/1.png",
    images: ["/products/pitch-black-booster-box/1.png"],
    isNew: true,
    popularity: 85,
    rating: 4.8,
    description:
      "Factory-sealed booster box for the Mega Evolution: Pitch Black expansion, featuring Mega Darkrai ex, Mega Zeraora ex, Mega Chandelure ex, and Mega Excadrill ex. 36 packs per box, 10 cards per pack.",
  },
  "team-rockets-zapdos-stamped-promo-destined-rivals": {
    category: "singles",
    rarity: "Rare",
    sku: "RDX-SGL-ZAPDOS-070",
    caseQty: "1 sealed card",
    art: { from: "#78350f", to: "#facc15", emoji: "⚡" },
    image: "/products/team-rockets-zapdos-stamped-promo-destined-rivals/1.webp",
    images: [
      "/products/team-rockets-zapdos-stamped-promo-destined-rivals/1.webp",
      "/products/team-rockets-zapdos-stamped-promo-destined-rivals/2.jpg",
      "/products/team-rockets-zapdos-stamped-promo-destined-rivals/3.jpg",
    ],
    popularity: 75,
    rating: 4.7,
    description:
      "Sealed, stamped promo of Team Rocket's Zapdos — card 070/182, a Lightning-type Basic Pokémon at 120 HP, from the Destined Rivals set.",
  },
  "psa-9-mint-rockets-tyranitar-096-prerelease-staff-destined-rivals-2025": {
    category: "graded",
    rarity: "Rare",
    sku: "RDX-GR-DR-STAFF-SET4",
    caseQty: "4 slabs / set",
    art: { from: "#78350f", to: "#fbbf24", emoji: "🏆" },
    image: "/products/psa-9-mint-rockets-tyranitar-096-prerelease-staff-destined-rivals-2025/1.png",
    images: Array.from(
      { length: 11 },
      (_, i) =>
        `/products/psa-9-mint-rockets-tyranitar-096-prerelease-staff-destined-rivals-2025/${i + 1}.${
          i < 3 ? "png" : "jpg"
        }`,
    ),
    grading: { company: "PSA", grade: 9, certNumber: "136383041–136383044 (sequential)" },
    isBestSeller: true,
    popularity: 92,
    rating: 5.0,
    description:
      "A complete, sequentially-certified set of four PSA 9 Mint prerelease STAFF promos from Destined Rivals: Ethan's Typhlosion (034), Misty's Gyarados (049), Team Rocket's Tyranitar (096), and Team Rocket's Mimikyu (087). Tournament-store-exclusive stamped variants, rarely found sequentially graded.",
  },
  "japanese-pokemon-m6-storm-emeralda-delta-region-booster-boxes-packs": {
    category: "japanese",
    language: "Japanese",
    sku: "RDX-JP-M6-STORM-BB",
    caseQty: "30 packs / box",
    price: 1799.99,
    art: { from: "#065f46", to: "#10b981", emoji: "🌪️" },
    image: "/products/japanese-pokemon-m6-storm-emeralda-delta-region-booster-boxes-packs/1.webp",
    images: [
      "/products/japanese-pokemon-m6-storm-emeralda-delta-region-booster-boxes-packs/1.webp",
      "/products/japanese-pokemon-m6-storm-emeralda-delta-region-booster-boxes-packs/2.webp",
      "/products/japanese-pokemon-m6-storm-emeralda-delta-region-booster-boxes-packs/3.png",
    ],
    isNew: true,
    availability: "in-stock",
    popularity: 80,
    rating: 4.8,
    description:
      "Sixth Mega-series expansion of the Japanese Pokémon TCG, Storm Emeralda, centered on Mega Rayquaza ex — localized in English as Delta Reign. Sealed booster box: 30 packs per box, 5 cards per pack.",
  },
};

export const products: Product[] = (importedProducts as Product[]).map((p) => {
  const enrichment = ENRICHMENTS[p.slug];
  return enrichment ? { ...p, ...enrichment } : p;
});

export function priceOf(product: Product): number {
  return product.price ?? 99;
}

// ---- Lookup & query helpers (drop-in replaceable by API calls later) ----

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeatured(limit = 8): Product[] {
  return [...products].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return products.filter((p) => p.isBestSeller).slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  return products.filter((p) => p.isNew || p.isPreOrder).slice(0, limit);
}

export function getClearance(limit = 8): Product[] {
  return products.filter((p) => p.isClearance).slice(0, limit);
}

export function getRelated(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, limit);
}

export function allSets(): string[] {
  return Array.from(new Set(products.map((p) => p.set))).sort();
}

export function allBrands(): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export function allLanguages(): string[] {
  return Array.from(new Set(products.map((p) => p.language))).sort();
}
