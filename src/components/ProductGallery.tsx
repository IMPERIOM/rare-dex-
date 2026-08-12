"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { CardArt } from "./CardArt";

/** Zoomable gallery. Cycles through the product's real photos when available
 * (product.images), falling back to a single view for products that only
 * have one photo (or none, via CardArt's gradient fallback). */
export function ProductGallery({ product }: { product: Product }) {
  const [zoom, setZoom] = useState(false);
  const photos = product.images?.length ? product.images : product.image ? [product.image] : [];
  const [active, setActive] = useState(0);
  const activeSrc = photos[active];

  return (
    <div>
      <div
        className={`card-premium relative overflow-hidden ${
          zoom ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onClick={() => setZoom((z) => !z)}
      >
        <CardArt
          product={product}
          imageSrc={activeSrc}
          showLabel={false}
          className={`aspect-square w-full transition-transform duration-300 ${
            zoom ? "scale-150" : "scale-100"
          }`}
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15">
          {zoom ? "Click to zoom out" : "Click to zoom"}
        </span>
      </div>

      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {photos.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-xl border p-1.5 transition ${
                active === i
                  ? "border-royal ring-1 ring-royal"
                  : "border-line hover:border-line-strong"
              }`}
              aria-label={`View ${i + 1}`}
            >
              <CardArt
                product={product}
                imageSrc={src}
                showLabel={false}
                className="aspect-square w-full rounded-md"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
