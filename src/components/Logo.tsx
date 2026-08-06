import Link from "next/link";

/**
 * RareDexCards logo — the brand emblem image (contains the full wordmark).
 * Props are kept backwards-compatible with earlier call sites (tone / size /
 * showWordmark / showTagline) even though the artwork now carries the text.
 */
export function Logo({
  size = 44,
  href = "/",
  className = "",
}: {
  tone?: "dark" | "light";
  size?: number;
  showWordmark?: boolean;
  showTagline?: boolean;
  href?: string | null;
  className?: string;
}) {
  const inner = (
    <span className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-raredex.jpg"
        alt="RareDexCards"
        width={size}
        height={size}
        style={{ height: size, width: size }}
        className="rounded-xl object-cover drop-shadow-[0_2px_10px_rgba(124,58,237,0.45)]"
      />
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} aria-label="RareDexCards — home" className="inline-flex">
      {inner}
    </Link>
  );
}
