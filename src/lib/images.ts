import type { ProductCategory } from "./types";

// Real internet images (free-licensed, no API key), keyword-matched so the
// site shows genuine photography instead of flat placeholders.
//
//  - realImg  -> LoremFlickr: real Flickr photos matched to keywords
//  - avatarImg -> Pravatar: real portrait photos (for people/testimonials)
//  - placeholderImg -> placehold.co: labelled fallback (kept for edge cases)
//
// NOTE: these are representative stock photos, not photos of the exact
// product. Replace with real product photography (set product.image to a CDN
// URL) before launch. No copyrighted card scans are hotlinked.

/** A real keyword-matched photo. `seed` keeps each slot's image stable. */
export function realImg(
  keywords: string,
  seed: string | number,
  w = 600,
  h = 800,
): string {
  const kw = encodeURIComponent(keywords);
  const lock = encodeURIComponent(String(seed));
  return `https://loremflickr.com/${w}/${h}/${kw}?lock=${lock}`;
}

/** A real portrait photo, stable per `seed` (name/id). */
export function avatarImg(seed: string | number): string {
  return `https://i.pravatar.cc/160?u=${encodeURIComponent(String(seed))}`;
}

/** Labelled placeholder fallback (placehold.co). Colors are hex WITHOUT '#'. */
export function placeholderImg(
  text: string,
  opts: { w?: number; h?: number; bg?: string; fg?: string } = {},
): string {
  const { w = 600, h = 400, bg = "1f2937", fg = "ffffff" } = opts;
  const t = encodeURIComponent(text).replace(/%20/g, "+");
  return `https://placehold.co/${w}x${h}/${bg}/${fg}/png?text=${t}&font=montserrat`;
}

/** Search keywords used to pick a real photo for each product category. */
export const CATEGORY_KEYWORDS: Record<ProductCategory, string> = {
  "booster-boxes": "pokemon,trading,cards,box",
  etbs: "pokemon,trading,cards",
  "booster-packs": "pokemon,cards,pack",
  "premium-collections": "pokemon,cards,premium",
  "collection-boxes": "pokemon,cards,collection",
  tins: "pokemon,tin,collectible",
  "sleeved-boosters": "trading,cards,pack",
  "build-battle": "trading,cards,game",
  graded: "trading,card,collectible",
  singles: "pokemon,trading,card",
  japanese: "japan,trading,cards",
  accessories: "card,sleeves,collectible",
  mystery: "mystery,box,cards",
  clearance: "trading,cards,box",
};
