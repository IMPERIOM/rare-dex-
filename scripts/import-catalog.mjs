#!/usr/bin/env node
// ---------------------------------------------------------------------------
// import-catalog.mjs — import a Shopify "Products → Export" CSV into the store.
//
// This does NOT scrape or fetch any third-party site. It reads a CSV you
// already own (your Shopify admin export) and produces clean local files:
//   - exports/products.jsonl     one JSON product record per line
//   - exports/manifest.csv       handle, sku, title, price, compare, currency, image_url, local_path
//   - exports/image_failures.csv (only if --download-images is used)
//   - exports/import.log         every product/variant/image processed
//   - src/data/imported-products.json   mapped to this site's Product model
//
// Usage:
//   node scripts/import-catalog.mjs --input path/to/products_export.csv
//   node scripts/import-catalog.mjs                 # uses the bundled sample
//   node scripts/import-catalog.mjs --download-images   # fetch YOUR images
//
// Image note: with --download-images it downloads the image URLs found in the
// CSV. Only use that on an export you own the rights to. Shopify CDN size
// params (?width/&height/&v) are stripped so you fetch the original file.
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---- args ----
const args = process.argv.slice(2);
function flag(name) { return args.includes(`--${name}`); }
function opt(name, def) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
}
const INPUT = opt("input", path.join(__dirname, "fixtures", "sample-shopify-export.csv"));
const OUT_DIR = path.resolve(ROOT, opt("out", "exports"));
const IMAGES_DIR = path.join(OUT_DIR, "images");
const SITE_OUT = path.resolve(ROOT, opt("site-out", "src/data/imported-products.json"));
const CURRENCY = opt("currency", "USD");
const DOWNLOAD = flag("download-images");

// ---- RFC-4180 CSV parser (handles quotes, escaped "", commas & newlines) ----
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", i = 0, inQuotes = false;
  text = text.replace(/^﻿/, ""); // strip BOM
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function toObjects(rows) {
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1)
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => Object.fromEntries(header.map((h, idx) => [h, r[idx] ?? ""])));
}

// ---- helpers ----
const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.\-]/g, "")); return Number.isFinite(n) ? n : null; };
const stripHtml = (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const splitTags = (s) => String(s || "").split(",").map((t) => t.trim()).filter(Boolean);

// strip Shopify CDN size/version query params -> original file url
function originalUrl(url) {
  try {
    const u = new URL(url);
    ["width", "height", "v", "crop"].forEach((p) => u.searchParams.delete(p));
    u.search = u.searchParams.toString();
    return u.toString();
  } catch { return url; }
}
function extOf(url) {
  const m = originalUrl(url).match(/\.(jpg|jpeg|png|webp|gif|avif)(?:$|\?)/i);
  return m ? m[1].toLowerCase() : "jpg";
}

// map Shopify product_type / tags -> this site's ProductCategory
const CATEGORY_RULES = [
  [/build|battle|prerelease/, "build-battle"],
  [/elite trainer|\betb\b/, "etbs"],
  [/booster box|\bcase\b/, "booster-boxes"],
  [/sleeved/, "sleeved-boosters"],
  [/booster pack|blister|\bpack\b/, "booster-packs"],
  [/premium|ultra premium|\bupc\b/, "premium-collections"],
  [/collection box|collection/, "collection-boxes"],
  [/\btin\b/, "tins"],
  [/graded|psa|bgs|cgc|slab/, "graded"],
  [/japan/, "japanese"],
  [/mystery|repack/, "mystery"],
  [/clearance|closeout|overstock/, "clearance"],
  [/single/, "singles"],
  [/sleeve|toploader|binder|accessor|supply|supplies/, "accessories"],
];
function mapCategory(type, tags) {
  const hay = `${type} ${tags.join(" ")}`.toLowerCase();
  for (const [re, cat] of CATEGORY_RULES) if (re.test(hay)) return cat;
  return "booster-boxes";
}

const PALETTE = [
  ["#1f2937", "#dc2626"], ["#065f46", "#10b981"], ["#4c1d95", "#7c3aed"],
  ["#0c4a6e", "#0ea5e9"], ["#7c2d12", "#f97316"], ["#111827", "#fbbf24"],
  ["#1e3a8a", "#60a5fa"], ["#581c87", "#c084fc"],
];
function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

// ---- read + group ----
if (!fs.existsSync(INPUT)) { console.error(`✗ input not found: ${INPUT}`); process.exit(1); }
console.log(`→ Reading ${path.relative(ROOT, INPUT)}`);
const objs = toObjects(parseCSV(fs.readFileSync(INPUT, "utf8")));

const groups = new Map(); // handle -> { first, variantRows[], imageRows[] }
for (const r of objs) {
  const handle = (r["Handle"] || "").trim();
  if (!handle) continue;
  if (!groups.has(handle)) groups.set(handle, { rows: [] });
  groups.get(handle).rows.push(r);
}

// ---- build records ----
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(SITE_OUT), { recursive: true });

const log = [];
const records = [];
const manifest = [["handle", "sku", "title", "price", "compare_at_price", "currency", "image_url", "local_path"]];
const siteProducts = [];
let variantCount = 0, imageCount = 0, publishedSkipped = 0;

for (const [handle, g] of groups) {
  const head = g.rows.find((r) => (r["Title"] || "").trim()) || g.rows[0];
  const status = (head["Status"] || "active").toLowerCase();
  const published = (head["Published"] || "TRUE").toUpperCase();
  if (status === "draft" || status === "archived" || published === "FALSE") { publishedSkipped++; log.push(`SKIP  ${handle}  (status=${status})`); continue; }

  const title = (head["Title"] || handle).trim();
  const productType = (head["Type"] || head["Product Category"] || "").trim();
  const vendor = (head["Vendor"] || "").trim();
  const tags = splitTags(head["Tags"]);

  // variants: rows carrying price or SKU
  const variants = [];
  let vIndex = 0;
  for (const r of g.rows) {
    const price = num(r["Variant Price"]);
    const skuRaw = (r["Variant SKU"] || "").trim();
    if (price == null && !skuRaw) continue; // image-only row
    vIndex++;
    const optTitle = [r["Option1 Value"], r["Option2 Value"], r["Option3 Value"]]
      .map((x) => (x || "").trim()).filter((x) => x && x !== "Default Title").join(" / ") || "Default";
    const qtyRaw = (r["Variant Inventory Qty"] || "").trim();
    const available = qtyRaw === "" ? true : Number(qtyRaw) > 0;
    variants.push({
      sku: skuRaw || `${handle}-${vIndex}`,
      title: optTitle,
      price: price ?? 0,
      compare_at_price: num(r["Variant Compare At Price"]),
      available,
      _qty: qtyRaw === "" ? null : Number(qtyRaw),
    });
    variantCount++;
  }
  if (variants.length === 0) { log.push(`WARN  ${handle}  no variants`); }

  // images: any row with Image Src, deduped by original url, sorted by position
  const imgMap = new Map();
  for (const r of g.rows) {
    const src = (r["Image Src"] || "").trim();
    if (!src) continue;
    const orig = originalUrl(src);
    const pos = num(r["Image Position"]) ?? imgMap.size + 1;
    if (!imgMap.has(orig)) imgMap.set(orig, pos);
  }
  const imagesSorted = [...imgMap.entries()].sort((a, b) => a[1] - b[1]);
  const images = imagesSorted.map(([url], n) => ({
    url_original: url,
    local_path: `./exports/images/${handle}_${n + 1}.${extOf(url)}`,
  }));
  imageCount += images.length;

  // ---- generic record (matches your spec) ----
  records.push({
    handle, title, product_type: productType, vendor, tags, currency: CURRENCY,
    variants: variants.map(({ sku, title, price, compare_at_price, available }) => ({ sku, title, price, compare_at_price, available })),
    images,
  });

  // ---- manifest rows (one per variant) ----
  const primary = images[0] || { url_original: "", local_path: "" };
  for (const v of variants) {
    manifest.push([handle, v.sku, title, v.price, v.compare_at_price ?? "", CURRENCY, primary.url_original, primary.local_path]);
  }

  // ---- site Product model ----
  const [from, to] = PALETTE[hash(handle) % PALETTE.length];
  const anyAvail = variants.some((v) => v.available);
  const stock = variants.reduce((s, v) => s + (v._qty ?? 100), 0);
  siteProducts.push({
    id: handle,
    slug: handle,
    name: title,
    category: mapCategory(productType, tags),
    set: productType || vendor || "Imported",
    brand: vendor || "Imported",
    language: /japan/i.test(tags.join(" ")) ? "Japanese" : "English",
    rarity: "Sealed",
    condition: null,
    sku: variants[0]?.sku ?? handle,
    caseQty: variants[0]?.title && variants[0].title !== "Default" ? variants[0].title : "1 unit",
    moq: 1,
    availability: anyAvail ? (stock > 0 && stock <= 10 ? "low-stock" : "in-stock") : "backorder",
    stock,
    art: { from, to, emoji: "📦" },
    image: images[0]?.url_original,
    price: variants[0]?.price ?? 0,
    authentic: true,
    popularity: 70,
    rating: 4.7,
    reviewCount: 0,
    description: stripHtml(head["Body (HTML)"]) || title,
  });

  log.push(`OK    ${handle}  variants=${variants.length}  images=${images.length}`);
}

// ---- optional image download ----
const failures = [["url", "reason"]];
if (DOWNLOAD) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  for (const rec of records) {
    for (const img of rec.images) {
      const dest = path.resolve(ROOT, img.local_path);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        log.push(`IMG   SKIP (exists)  ${img.url_original}`);
        continue; // resume: don't re-download completed files
      }
      try {
        const res = await fetch(img.url_original);
        log.push(`IMG   ${res.status}  ${img.url_original}`);
        if (!res.ok) { failures.push([img.url_original, `HTTP ${res.status}`]); continue; }
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
      } catch (e) {
        failures.push([img.url_original, String(e.message || e)]);
        log.push(`IMG   ERR  ${img.url_original}`);
      }
    }
  }
}

// ---- write outputs ----
const csv = (rows) => rows.map((r) => r.map((c) => {
  const s = String(c ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}).join(",")).join("\n") + "\n";

fs.writeFileSync(path.join(OUT_DIR, "products.jsonl"), records.map((r) => JSON.stringify(r)).join("\n") + "\n");
fs.writeFileSync(path.join(OUT_DIR, "manifest.csv"), csv(manifest));
fs.writeFileSync(path.join(OUT_DIR, "import.log"), log.join("\n") + "\n");
if (DOWNLOAD) fs.writeFileSync(path.join(OUT_DIR, "image_failures.csv"), csv(failures));
fs.writeFileSync(SITE_OUT, JSON.stringify(siteProducts, null, 2));

// ---- summary ----
console.log("\n──────── Import summary ────────");
console.log(`Handles found:      ${groups.size}`);
console.log(`Products imported:  ${records.length}`);
console.log(`  skipped (draft):  ${publishedSkipped}`);
console.log(`Variants:           ${variantCount}`);
console.log(`Images referenced:  ${imageCount}`);
if (DOWNLOAD) console.log(`Image failures:     ${failures.length - 1}`);
console.log(`\nWrote:`);
console.log(`  ${path.relative(ROOT, path.join(OUT_DIR, "products.jsonl"))}`);
console.log(`  ${path.relative(ROOT, path.join(OUT_DIR, "manifest.csv"))}`);
console.log(`  ${path.relative(ROOT, path.join(OUT_DIR, "import.log"))}`);
console.log(`  ${path.relative(ROOT, SITE_OUT)}  (${siteProducts.length} products in site model)`);
