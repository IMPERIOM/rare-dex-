import type { Product } from "@/lib/types";

/**
 * Product artwork tile — image-free. Renders a clean brand-gradient panel with
 * the category emoji and (optionally) the set label. No photography or
 * placeholder images are used anywhere in the catalog.
 */
export function CardArt({
  product,
  className = "",
  showLabel = true,
}: {
  product: Product;
  className?: string;
  showLabel?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${product.art.from}, ${product.art.to})`,
      }}
      role="img"
      aria-label={product.name}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_55%)]" />
      <span className="select-none text-5xl drop-shadow-sm sm:text-6xl">
        {product.art.emoji}
      </span>
      {showLabel && (
        <span className="absolute bottom-2 left-2 right-2 truncate rounded bg-black/40 px-2 py-0.5 text-center text-[11px] font-medium text-white/90">
          {product.set}
        </span>
      )}
    </div>
  );
}
