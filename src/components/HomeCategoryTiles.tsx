import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealGroup, RevealItem } from "./motion";

// The seven homepage tiles, in the exact required order. Image-free — clean
// brand gradients + emoji motif.
const TILES = [
  { label: "New Arrivals", blurb: "Freshest drops, first", href: "/new-arrivals", emoji: "✨", from: "#1e3a8a", to: "#3b82f6", featured: true },
  { label: "Sealed", blurb: "Boxes · ETBs · cases", href: "/shop?category=booster-boxes", emoji: "📦", from: "#1e40af", to: "#6366f1" },
  { label: "Singles", blurb: "Bulk single lots", href: "/shop?category=singles", emoji: "🃏", from: "#a16207", to: "#facc15" },
  { label: "Graded", blurb: "PSA · BGS · CGC", href: "/graded", emoji: "🏆", from: "#111827", to: "#4b5563" },
  { label: "Accessories", blurb: "Sleeves & supplies", href: "/shop?category=accessories", emoji: "🛡️", from: "#0f766e", to: "#2dd4bf" },
  { label: "Mystery Boxes", blurb: "Repacks & hit lots", href: "/shop?category=mystery", emoji: "💎", from: "#4a044e", to: "#d946ef" },
  { label: "Preorder", blurb: "Lock in allocation", href: "/pre-orders", emoji: "⚡", from: "#4c1d95", to: "#a855f7" },
];

export function HomeCategoryTiles() {
  return (
    <RevealGroup className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {TILES.map((t) => (
        <RevealItem key={t.label} className={t.featured ? "col-span-2 row-span-2" : ""}>
          <Link
            href={t.href}
            className="holo group relative flex h-full flex-col justify-end overflow-hidden rounded-[var(--radius-card)] border border-line p-4 transition hover:-translate-y-0.5"
            style={{ backgroundImage: `linear-gradient(150deg, ${t.from}, ${t.to})` }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className={`absolute right-3 top-3 ${t.featured ? "text-6xl" : "text-4xl"} opacity-90 drop-shadow-lg transition group-hover:scale-110`}>
              {t.emoji}
            </span>
            <div className="relative flex items-end justify-between">
              <div>
                <p className={`font-bold text-white ${t.featured ? "text-2xl" : "text-base"}`}>{t.label}</p>
                <p className="mt-0.5 text-xs text-white/70">{t.blurb}</p>
              </div>
              <span className="rounded-full border border-white/25 bg-white/10 p-1.5 text-white transition group-hover:bg-white/20">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
