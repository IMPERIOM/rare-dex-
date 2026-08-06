"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Zap, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { buttonClasses } from "./ui/Button";
import { SITE } from "@/lib/format";

/** Product buy box — quantity + Add to Cart / Buy Now, plus a WhatsApp option. */
export function BuyBox({ productId, moq }: { productId: string; moq: number }) {
  const { addItem, openCart } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(Math.max(1, moq));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">Quantity (min {moq})</span>
        <div className="inline-flex items-center rounded-lg border border-line-strong bg-white/[0.03]">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(moq, q - 1))}
            className="px-3.5 py-2.5 text-lg text-muted hover:text-ink disabled:opacity-40"
            disabled={qty <= moq}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-semibold text-ink" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-3.5 py-2.5 text-lg text-muted hover:text-ink"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => { addItem(productId, qty); openCart(); }}
          className={buttonClasses("primary", "lg", "flex-1")}
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => { addItem(productId, qty); router.push("/checkout"); }}
          className={buttonClasses("gold", "lg", "flex-1")}
        >
          <Zap className="h-4 w-4" /> Buy Now
        </motion.button>
      </div>

      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses("glass", "md", "w-full")}
      >
        <MessageCircle className="h-4 w-4 text-emerald-400" /> Contact Sales on WhatsApp
      </a>
    </div>
  );
}
