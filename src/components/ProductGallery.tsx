"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { CardArt } from "./CardArt";

/**
 * Zoomable gallery. With real photography this maps to Next/Image with multiple
 * angles; for now it shows the product image with a hover-zoom affordance and a
 * set of thumbnail "views".
 */
export function ProductGallery({ product }: { product: Product }) {
  const [zoom, setZoom] = useState(false);
  const views = ["Front", "Back", "Angle", "Detail"];
  const [active, setActive] = useState(0);

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
          showLabel={false}
          className={`aspect-square w-full transition-transform duration-300 ${
            zoom ? "scale-150" : "scale-100"
          }`}
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15">
          {zoom ? "Click to zoom out" : "Click to zoom"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {views.map((v, i) => (
          <button
            key={v}
            onClick={() => setActive(i)}
            className={`flex flex-col items-center gap-1 rounded-xl border p-1.5 transition ${
              active === i
                ? "border-royal ring-1 ring-royal"
                : "border-line hover:border-line-strong"
            }`}
            aria-label={`View ${v}`}
          >
            <CardArt
              product={product}
              showLabel={false}
              className="aspect-square w-full rounded-md"
            />
            <span className="text-[10px] font-medium text-faint">{v}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
