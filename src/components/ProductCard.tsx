import Link from "next/link";
import { Layers, PackageCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { AVAILABILITY_LABELS } from "@/lib/types";
import { priceOf } from "@/lib/products";
import { formatUSD } from "@/lib/format";
import { CardArt } from "./CardArt";
import { ProductBadges } from "./Badge";
import { Badge } from "./ui/Badge";
import { AddToCartButton } from "./AddToCartButton";

const AVAIL_TONE = {
  "in-stock": "green",
  "low-stock": "amber",
  "pre-order": "violet",
  backorder: "neutral",
} as const;

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card-premium group flex flex-col overflow-hidden">
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-t-[var(--radius-card)]"
        aria-label={product.name}
      >
        <CardArt
          product={product}
          showLabel={false}
          className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <ProductBadges product={product} />
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge tone={AVAIL_TONE[product.availability]}>
            {AVAILABILITY_LABELS[product.availability]}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-royal">
          {product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-ink">
          <Link href={`/product/${product.slug}`} className="hover:text-white">
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 space-y-1 text-xs text-muted">
          <p className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-faint" /> {product.caseQty}
          </p>
          <p className="flex items-center gap-1.5">
            <PackageCheck className="h-3.5 w-3.5 text-faint" /> MOQ {product.moq}
          </p>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-ink">{formatUSD(priceOf(product))}</span>
            <span className="text-[11px] text-faint">/ unit</span>
          </div>
          <AddToCartButton productId={product.id} className="mt-2.5" />
        </div>
      </div>
    </div>
  );
}
