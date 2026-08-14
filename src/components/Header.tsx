"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ShoppingCart,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SITE } from "@/lib/format";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";


type Badge = { text: string; cls: string };
type NavItem = {
  label: string;
  href?: string;
  badge?: Badge;
  items?: { label: string; href: string }[];
};

const BADGE = {
  pink: "bg-pink-500 text-white",
  gold: "bg-gold text-[#1a1205]",
  teal: "bg-teal-400 text-[#04201c]",
};

const NAV: NavItem[] = [
  { label: "New Arrivals", href: "/new-arrivals" },
  {
    label: "Sealed",
    badge: { text: "New", cls: BADGE.pink },
    items: [
      { label: "Booster Boxes", href: "/shop?category=booster-boxes" },
      { label: "Elite Trainer Boxes", href: "/shop?category=etbs" },
      { label: "Booster Packs", href: "/shop?category=booster-packs" },
      { label: "Premium Collections", href: "/shop?category=premium-collections" },
      { label: "Collection Boxes", href: "/shop?category=collection-boxes" },
      { label: "Tins", href: "/shop?category=tins" },
      { label: "Sleeved Boosters", href: "/shop?category=sleeved-boosters" },
      { label: "Build & Battle Kits", href: "/shop?category=build-battle" },
    ],
  },
  {
    label: "Singles",
    items: [
      { label: "Bulk Single Lots", href: "/shop?category=singles" },
      { label: "Japanese Pokémon", href: "/shop?category=japanese" },
    ],
  },
  {
    label: "Graded",
    badge: { text: "Premium", cls: BADGE.gold },
    items: [
      { label: "All Graded Lots", href: "/graded" },
      { label: "PSA Slabs", href: "/graded" },
      { label: "BGS Slabs", href: "/graded" },
      { label: "CGC Slabs", href: "/graded" },
    ],
  },
  {
    label: "Accessories",
    badge: { text: "Essentials", cls: BADGE.teal },
    items: [
      { label: "Toploaders", href: "/shop?category=accessories" },
      { label: "Card Sleeves", href: "/shop?category=accessories" },
      { label: "All Supplies", href: "/shop?category=accessories" },
    ],
  },
  {
    label: "Mystery Boxes",
    items: [
      { label: "Mystery Repacks", href: "/shop?category=mystery" },
      { label: "Guaranteed Hit Lots", href: "/shop?category=mystery" },
    ],
  },
  { label: "Pre-Orders", href: "/pre-orders" },
];

export function Header() {
  const { count, openCart, bump } = useCart();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line glass-strong">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-muted hover:bg-white/[0.06] hover:text-ink xl:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Logo tone="light" size={68} className="shrink-0" />

        {/* Desktop nav */}
        <nav className="ml-3 hidden items-center xl:flex">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpen(item.label)}
              onMouseLeave={() => setOpen(null)}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="relative flex items-center gap-1 px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-muted transition hover:text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <button className="relative flex items-center gap-1 px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-muted transition hover:text-ink">
                  {item.label}
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform", open === item.label && "rotate-180")}
                  />
                </button>
              )}
              {item.badge && (
                <span
                  className={cn(
                    "pointer-events-none absolute -top-1.5 left-2 rounded-full px-1.5 py-[1px] text-[8px] font-bold uppercase leading-none tracking-wide",
                    item.badge.cls,
                  )}
                >
                  {item.badge.text}
                </span>
              )}

              <AnimatePresence>
                {open === item.label && item.items && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.16 }}
                    className="glass-strong absolute left-0 top-full mt-1 w-60 overflow-hidden rounded-xl p-1.5 shadow-[var(--shadow-lift)]"
                  >
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setOpen(null)}
                        className="block rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/[0.07] hover:text-ink"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/shop"
            className="hidden rounded-lg p-2 text-muted hover:bg-white/[0.06] hover:text-ink md:inline-flex"
            aria-label="Search catalog"
          >
            <Search className="h-5 w-5" />
          </Link>
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="relative inline-flex rounded-lg p-2 text-[#25D366] transition hover:bg-white/[0.06]"
          >
            <span className="absolute inset-1.5 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.4s]" aria-hidden="true" />
            <MessageCircle className="relative h-5 w-5" />
          </a>
          <button
            onClick={openCart}
            className="relative inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white/[0.03] px-3 py-2 text-sm font-medium text-ink transition hover:bg-white/[0.08]"
            aria-label="Open cart"
          >
            <motion.span key={bump} animate={{ scale: [1, 1.45, 1], rotate: [0, -12, 0] }} transition={{ duration: 0.45 }}>
              <ShoppingCart className="h-4 w-4" />
            </motion.span>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <motion.span
                key={`c-${count}`}
                initial={{ scale: 0.4 }}
                animate={{ scale: [0.4, 1.3, 1] }}
                transition={{ duration: 0.35 }}
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-[#1a1205]"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.28 }}
              className="glass-strong absolute left-0 top-0 h-full w-80 max-w-[86%] overflow-y-auto p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <Logo tone="light" size={56} href={null} showTagline={false} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-muted hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => { setMobileOpen(false); openCart(); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-royal to-violet px-5 py-3 text-sm font-semibold text-white"
              >
                <ShoppingCart className="h-4 w-4" /> View Cart ({count})
              </button>

              <nav className="mt-6 space-y-1">
                {NAV.map((item) => (
                  <div key={item.label} className="border-b border-line pb-2">
                    <div className="flex items-center gap-2 px-1 py-2">
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-sm font-bold uppercase tracking-wide text-ink"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-sm font-bold uppercase tracking-wide text-ink">
                          {item.label}
                        </span>
                      )}
                      {item.badge && (
                        <span className={cn("rounded-full px-1.5 py-[1px] text-[8px] font-bold uppercase", item.badge.cls)}>
                          {item.badge.text}
                        </span>
                      )}
                    </div>
                    {item.items && (
                      <div className="grid grid-cols-1">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-white/[0.06] hover:text-ink"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-4 grid grid-cols-1 gap-0.5">
                {[
                  { label: "Wholesale Program", href: "/wholesale-program" },
                  { label: "Brands", href: "/brands" },
                  { label: "Contact", href: "/contact" },
                ].map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/[0.06] hover:text-ink"
                  >
                    {n.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
}

