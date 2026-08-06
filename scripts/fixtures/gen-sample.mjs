// Generates a correctly-aligned sample Shopify export CSV (field arrays →
// guaranteed column alignment). Run: node scripts/fixtures/gen-sample.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));

const HEADER = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
  "Variant SKU", "Variant Inventory Qty", "Variant Price",
  "Variant Compare At Price", "Image Src", "Image Position", "Image Alt Text", "Status",
];
const B = "https://cdn.shopify.com/s/files/1/0000/0001/";
// helper: build a 19-field row from a partial map keyed by column name
const row = (m) => HEADER.map((h) => m[h] ?? "");

const rows = [
  // product with 1 variant + 2 images (2nd row image-only)
  row({ Handle: "chaos-rising-booster-box", Title: "Chaos Rising Booster Box", "Body (HTML)": "<p>Factory-sealed 36-pack <strong>booster box</strong>. 100% authentic.</p>", Vendor: "RareDex", Type: "Booster Boxes", Tags: "sealed, english, new", Published: "TRUE", "Option1 Name": "Title", "Option1 Value": "Default Title", "Variant SKU": "RDX-CR-BB", "Variant Inventory Qty": "12", "Variant Price": "209.99", "Variant Compare At Price": "249.99", "Image Src": B + "box.jpg?width=1200", "Image Position": "1", "Image Alt Text": "Chaos Rising Booster Box", Status: "active" }),
  row({ Handle: "chaos-rising-booster-box", "Image Src": B + "box-back.jpg?v=17250001", "Image Position": "2" }),

  // product with 2 real variants + 1 image-only variant row + 3 images
  row({ Handle: "chaos-rising-3pack", Title: "Chaos Rising 3-Pack Blister", "Body (HTML)": "<p>Three-pack blister with promo card.</p>", Vendor: "RareDex", Type: "Booster Packs", Tags: "sealed, english", Published: "TRUE", "Option1 Name": "Style", "Option1 Value": "Charmander", "Variant SKU": "RDX-CR-3P-CHAR", "Variant Inventory Qty": "40", "Variant Price": "29.99", "Variant Compare At Price": "39.99", "Image Src": B + "blister-charmander.jpg?width=800&height=800", "Image Position": "1", "Image Alt Text": "Charmander blister", Status: "active" }),
  row({ Handle: "chaos-rising-3pack", "Option1 Name": "Style", "Option1 Value": "Squirtle", "Variant SKU": "RDX-CR-3P-SQUIR", "Variant Inventory Qty": "0", "Variant Price": "29.99", "Variant Compare At Price": "39.99", "Image Src": B + "blister-squirtle.png", "Image Position": "2", "Image Alt Text": "Squirtle blister" }),
  row({ Handle: "chaos-rising-3pack", "Image Src": B + "blister-bulbasaur.png", "Image Position": "3", "Image Alt Text": "Bulbasaur blister" }),

  // out-of-stock, no compare-at price, .png with size+version params
  row({ Handle: "chaos-rising-etb", Title: "Chaos Rising Elite Trainer Box", "Body (HTML)": "<p>ETB containing 9 booster packs, dice &amp; sleeves.</p>", Vendor: "RareDex", Type: "Elite Trainer Boxes", Tags: "sealed, english, bestseller", Published: "TRUE", "Option1 Name": "Title", "Option1 Value": "Default Title", "Variant SKU": "RDX-CR-ETB", "Variant Inventory Qty": "0", "Variant Price": "59.99", "Image Src": B + "etb.png?width=1500&v=99", "Image Position": "1", "Image Alt Text": "Chaos Rising ETB", Status: "active" }),

  // no SKU (importer generates a dedup key), high price
  row({ Handle: "graded-charizard-psa10", Title: "Charizard PSA 10 Gem Mint", "Body (HTML)": "<p>Slabbed &amp; certified.</p>", Vendor: "Graded", Type: "Graded Cards", Tags: "graded, psa, single", Published: "TRUE", "Option1 Name": "Title", "Option1 Value": "Default Title", "Variant Inventory Qty": "3", "Variant Price": "2499.00", "Image Src": B + "charizard-psa10.jpg", "Image Position": "1", "Image Alt Text": "PSA 10 Charizard", Status: "active" }),

  // draft product — importer should skip it
  row({ Handle: "hidden-draft", Title: "Unreleased Draft Product", Vendor: "RareDex", Type: "Booster Boxes", Published: "FALSE", "Option1 Name": "Title", "Option1 Value": "Default Title", "Variant SKU": "RDX-DRAFT", "Variant Inventory Qty": "5", "Variant Price": "99.99", Status: "draft" }),
];

const esc = (c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c);
const csv = [HEADER, ...rows].map((r) => r.map(esc).join(",")).join("\n") + "\n";
fs.writeFileSync(path.join(dir, "sample-shopify-export.csv"), csv);
console.log("Wrote sample-shopify-export.csv");
