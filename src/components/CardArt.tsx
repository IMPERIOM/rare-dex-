import Image from "next/image";
import type { Product } from "@/lib/types";

/**
 * Product artwork tile. Renders real product photography when
 * `product.image` is set, falling back to a brand-gradient panel with the
 * category emoji for products that don't have photography yet.
 */
export function CardArt({
  product,
  className = "",
  showLabel = true,
  imageSrc,
}: {
  product: Product;
  className?: string;
  showLabel?: boolean;
  /** Override the image shown (used by the gallery for alternate views). */
  imageSrc?: string;
}) {
  const src = imageSrc ?? product.image;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={
        src
          ? undefined
          : { backgroundImage: `linear-gradient(135deg, ${product.art.from}, ${product.art.to})` }
      }
      role="img"
      aria-label={product.name}
    >
      {src ? (
        <Image
          src={src}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover"
        />
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_55%)]" />
          <span className="select-none text-5xl drop-shadow-sm sm:text-6xl">
            {product.art.emoji}
          </span>
        </>
      )}
      {showLabel && (
        <span className="absolute bottom-2 left-2 right-2 truncate rounded bg-black/40 px-2 py-0.5 text-center text-[11px] font-medium text-white/90">
          {product.set}
        </span>
      )}
    </div>
  );
}
