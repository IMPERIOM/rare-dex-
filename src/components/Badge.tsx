import type { Product } from "@/lib/types";
import { Badge } from "./ui/Badge";

export { Badge };

/** Derives the standard set of status badges for a wholesale product. */
export function ProductBadges({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.isBestSeller && <Badge tone="gold">Best Seller</Badge>}
      {product.isNew && <Badge tone="royal">New Arrival</Badge>}
      {product.isPreOrder && <Badge tone="violet">Pre-Order</Badge>}
      {product.isClearance && <Badge tone="amber">Clearance</Badge>}
      {product.grading && (
        <Badge tone="neutral">
          {product.grading.company} {product.grading.grade}
        </Badge>
      )}
    </div>
  );
}
