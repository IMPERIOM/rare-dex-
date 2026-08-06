"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Truck, ShieldCheck } from "lucide-react";
import { buttonClasses } from "./ui/Button";
import { SITE } from "@/lib/format";

const FAN = [
  { emoji: "📦", from: "#1e3a8a", to: "#3b82f6", r: -8, y: 0 },
  { emoji: "💎", from: "#4c1d95", to: "#a855f7", r: 4, y: -24 },
  { emoji: "⚡", from: "#7c2d12", to: "#fbbf24", r: 14, y: 8 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-royal/25 blur-[120px]" />
      <div className="pointer-events-none absolute -top-20 right-1/4 h-96 w-96 rounded-full bg-violet/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-gold"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Global Wholesale
            Supplier
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Your Trusted Global{" "}
            <span className="text-gradient">Pokémon Wholesale</span> Partner
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-base text-muted sm:text-lg"
          >
            Supplying authentic Pokémon TCG products in bulk to retailers,
            distributors, and resellers worldwide — sealed cases, graded lots,
            and accessories at true wholesale volume.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.19 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/new-arrivals" className={buttonClasses("primary", "lg")}>
              <Sparkles className="h-5 w-5" /> Shop New Arrivals
            </Link>
            <Link href="/shop" className={buttonClasses("glass", "lg")}>
              Browse Full Catalog
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300"
          >
            <Truck className="h-4 w-4" /> FREE shipping on every order · ${SITE.minOrder} minimum
          </motion.div>
        </div>

        {/* Card collage */}
        <div className="relative hidden h-[420px] lg:block" aria-hidden="true">
          {FAN.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotate: c.r * 1.5 }}
              animate={{ opacity: 1, y: c.y, rotate: c.r }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="ring-gradient holo absolute flex h-80 w-56 items-center justify-center rounded-2xl shadow-[var(--shadow-lift)]"
              style={{ left: `${8 + i * 24}%`, top: "6%", backgroundImage: `linear-gradient(150deg, ${c.from}, ${c.to})` }}
            >
              <span className="text-6xl drop-shadow-lg">{c.emoji}</span>
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
