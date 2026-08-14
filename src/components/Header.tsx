"use client";

import { useState, useEffect } from "react";
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
          <div className="fixed inset-0 z-[9999]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.32 }}
              className="bg-[#0b0e14] border-r border-line-strong absolute left-0 top-0 flex h-dvh max-h-dvh w-80 max-w-[86%] flex-col p-5 shadow-2xl overflow-hidden z-10"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* Header section (fixed at top of drawer) */}
              <div className="shrink-0 mb-4 flex items-center justify-between border-b border-line pb-4">
                <Logo tone="light" size={56} href="/" showTagline={false} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-muted hover:bg-white/10 hover:text-ink"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable inner content area */}
              <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-4">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setMobileOpen(false); openCart(); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-royal via-indigo-600 to-violet px-5 py-3 text-sm font-semibold text-white shadow-lg"
                  >
                    <ShoppingCart className="h-4 w-4" /> View Cart ({count})
                  </button>

                  <a
                    href={SITE.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-5 py-2.5 text-sm font-semibold text-[#25D366] hover:bg-[#25D366]/20"
                  >
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>

                <nav className="space-y-2">
                  {NAV.map((item) => (
                    <div key={item.label} className="border-b border-line/60 pb-3">
                      <div className="flex items-center gap-2 px-1 py-1.5">
                        {item.href ? (
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-sm font-bold uppercase tracking-wide text-ink hover:text-gold"
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
                        <div className="mt-1 grid grid-cols-1 gap-1 pl-2">
                          {item.items.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-white/[0.08] hover:text-ink"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="border-t border-line pt-4 space-y-1 pb-4">
                  {[
                    { label: "Shop All Catalog", href: "/shop" },
                    { label: "Wholesale Program", href: "/wholesale-program" },
                    { label: "Brands & Sets", href: "/brands" },
                    { label: "Contact Us", href: "/contact" },
                  ].map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-white/[0.08] hover:text-ink"
                    >
                      {n.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
}

