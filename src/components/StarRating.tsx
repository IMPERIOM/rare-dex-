export function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const textSize = size === "md" ? "text-base" : "text-sm";
  return (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <span className="text-gold" aria-hidden="true">
        {"★".repeat(full)}
        {hasHalf ? "⯪" : ""}
        <span className="text-white/15">
          {"★".repeat(Math.max(0, 5 - full - (hasHalf ? 1 : 0)))}
        </span>
      </span>
      <span className="sr-only">{rating} out of 5 stars</span>
      {typeof count === "number" && (
        <span className="text-xs font-medium text-faint">({count})</span>
      )}
    </div>
  );
}
