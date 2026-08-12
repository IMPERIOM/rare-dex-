// Core domain types for the RareDexCards wholesale catalog.
// Mirrors the intended Supabase schema so mock data swaps to the API cleanly.

export type Condition = "NM" | "LP" | "MP" | "HP" | "DMG";

export const CONDITION_LABELS: Record<Condition, string> = {
  NM: "Near Mint",
  LP: "Lightly Played",
  MP: "Moderately Played",
  HP: "Heavily Played",
  DMG: "Damaged",
};

export type GradingCompany = "PSA" | "BGS" | "CGC";

export type ProductCategory =
  | "booster-boxes"
  | "etbs"
  | "booster-packs"
  | "premium-collections"
  | "collection-boxes"
  | "tins"
  | "sleeved-boosters"
  | "build-battle"
  | "graded"
  | "singles"
  | "japanese"
  | "accessories"
  | "mystery"
  | "clearance";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "booster-boxes": "Booster Boxes",
  etbs: "Elite Trainer Boxes",
  "booster-packs": "Booster Packs",
  "premium-collections": "Premium Collections",
  "collection-boxes": "Collection Boxes",
  tins: "Tins",
  "sleeved-boosters": "Sleeved Boosters",
  "build-battle": "Build & Battle Kits",
  graded: "Graded Cards",
  singles: "Singles (Bulk Lots)",
  japanese: "Japanese Pokémon",
  accessories: "Accessories",
  mystery: "Mystery Products",
  clearance: "Clearance Inventory",
};

/** Short blurbs used in the mega menu / category cards. */
export const CATEGORY_BLURBS: Partial<Record<ProductCategory, string>> = {
  "booster-boxes": "Sealed cases & display boxes",
  etbs: "Full ETB assortments",
  "booster-packs": "Loose & display packs",
  "premium-collections": "Premium & UPC boxes",
  "collection-boxes": "Collection & gift boxes",
  tins: "Poké Ball & set tins",
  "sleeved-boosters": "Blister & sleeved packs",
  "build-battle": "Prerelease & battle kits",
  graded: "PSA · BGS · CGC slabs",
  singles: "Sorted bulk singles",
  japanese: "Direct-from-Japan sealed",
  accessories: "Sleeves, toploaders & supplies",
  mystery: "Mystery & repack lots",
  clearance: "Overstock & closeouts",
};

export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Holo Rare"
  | "Ultra Rare"
  | "Secret Rare"
  | "Illustration Rare"
  | "Sealed";

export interface GradingInfo {
  company: GradingCompany;
  grade: number;
  certNumber: string;
}

export type Availability = "in-stock" | "low-stock" | "pre-order" | "backorder";

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "pre-order": "Pre-Order",
  backorder: "Backorder",
};

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  set: string;
  brand: string; // manufacturer / origin line
  language: string;
  rarity: Rarity;
  condition: Condition | null;
  sku: string;
  caseQty: string; // e.g. "6 boxes / case"
  moq: number; // minimum order quantity (cases/units)
  availability: Availability;
  stock: number;
  art: { from: string; to: string; emoji: string };
  image?: string;
  images?: string[];
  /** Per-unit USD price. Falls back to the legacy PRICES map in products.ts
   * when absent (kept for the handful of hand-authored products). */
  price?: number;
  authentic: boolean;
  grading?: GradingInfo;
  isNew?: boolean;
  isBestSeller?: boolean;
  isClearance?: boolean;
  isPreOrder?: boolean;
  popularity: number;
  rating: number;
  reviewCount: number;
  description: string;
}

/** A line in the wholesale quote request (quantity of cases/units). */
export interface QuoteLine {
  productId: string;
  quantity: number;
}

// Back-compat alias (the quote system reuses the former cart plumbing).
export type CartLine = QuoteLine;
