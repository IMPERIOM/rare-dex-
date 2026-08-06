"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Truck, Sparkles } from "lucide-react";
import { buttonClasses } from "./ui/Button";
import { SITE } from "@/lib/format";

const KEY = "raredex.promo.seen.v1";

export function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function close() {
    sessionStorage.setItem(KEY, "1");
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="ring-gradient holo relative w-full max-w-md overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]"
            role="dialog"
            aria-modal="true"
            aria-label="Promotion"
          >
            {/* gradient promo banner (image-free) */}
            <div className="relative flex h-32 items-center justify-center overflow-hidden [background:linear-gradient(120deg,#1e3a8a,#4c1d95,#6d28d9,#1e3a8a)] [background-size:300%_300%] [animation:foil-pan_10s_linear_infinite]">
              <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
              <span className="text-6xl drop-shadow-lg">🎴</span>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold ring-1 ring-white/15">
                <Sparkles className="h-3 w-3" /> New Drop
              </span>
            </div>

            <button
              onClick={close}
              className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white ring-1 ring-white/15 hover:bg-black/70"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="bg-surface p-6 text-center">
              <h2 className="text-2xl font-black">
                Fresh <span className="foil-text">Wholesale Drops</span> Just Landed
              </h2>
              <p className="mt-2 text-sm text-muted">
                Restock your shelves with the newest sealed cases, graded lots &amp;
                Japanese imports at true wholesale pricing.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Truck className="h-3.5 w-3.5" /> FREE shipping on every order · ${SITE.minOrder} minimum
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <Link href="/new-arrivals" onClick={close} className={buttonClasses("primary", "md", "w-full")}>
                  Shop New Arrivals
                </Link>
                <button onClick={close} className="text-xs font-medium text-faint hover:text-muted">
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
