"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getProductById, priceOf } from "@/lib/products";
import { formatUSD, SITE } from "@/lib/format";
import { CardArt } from "./CardArt";
import { buttonClasses } from "./ui/Button";

export function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal, setQuantity, removeItem } = useCart();
  const metMin = subtotal >= SITE.minOrder;
  const remaining = Math.max(0, SITE.minOrder - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.32 }}
            className="glass-strong absolute right-0 top-0 flex h-full w-full max-w-md flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                <ShoppingCart className="h-5 w-5 text-gold" />
                Your Cart <span className="text-faint">({count})</span>
              </h2>
              <button onClick={closeCart} className="rounded-md p-1.5 text-muted hover:bg-white/10" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingCart className="h-10 w-10 text-faint" />
                <p className="text-sm text-muted">Your cart is empty.</p>
                <Link href="/shop" onClick={closeCart} className={buttonClasses("outline", "sm")}>
                  Browse catalog
                </Link>
              </div>
            ) : (
              <>
                {/* $500 minimum-order progress */}
                <div className="border-b border-line px-5 py-3">
                  {metMin ? (
                    <p className="text-xs font-semibold text-emerald-400">
                      🎉 $500 minimum met — your order ships FREE!
                    </p>
                  ) : (
                    <p className="text-xs text-muted">
                      Add <span className="font-semibold text-gold">{formatUSD(remaining)}</span> more to reach the{" "}
                      <span className="font-semibold text-ink">$500 minimum</span> &amp; unlock free shipping.
                    </p>
                  )}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all ${metMin ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-royal to-violet"}`}
                      style={{ width: `${Math.min(100, (subtotal / SITE.minOrder) * 100)}%` }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {lines.map((line) => {
                    const p = getProductById(line.productId);
                    if (!p) return null;
                    return (
                      <li key={line.productId} className="flex gap-3 py-4">
                        <CardArt product={p} showLabel={false} className="h-20 w-16 shrink-0 rounded-md" />
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <Link href={`/product/${p.slug}`} onClick={closeCart} className="text-sm font-semibold text-ink hover:underline">
                              {p.name}
                            </Link>
                            <button onClick={() => removeItem(p.id)} className="text-faint hover:text-red-400" aria-label={`Remove ${p.name}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs text-faint">{p.sku}</p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="inline-flex items-center rounded-lg border border-line-strong">
                              <button onClick={() => setQuantity(p.id, line.quantity - 1)} className="px-2.5 py-1 text-muted hover:text-ink" aria-label="Decrease">−</button>
                              <span className="w-8 text-center text-sm text-ink">{line.quantity}</span>
                              <button onClick={() => setQuantity(p.id, line.quantity + 1)} className="px-2.5 py-1 text-muted hover:text-ink" aria-label="Increase">+</button>
                            </div>
                            <span className="text-sm font-bold text-ink">{formatUSD(priceOf(p) * line.quantity)}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t border-line px-5 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-lg font-bold text-ink">{formatUSD(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-faint">Free shipping · taxes calculated at checkout.</p>
                  {metMin ? (
                    <Link href="/checkout" onClick={closeCart} className={buttonClasses("primary", "md", "mt-3 w-full")}>
                      Checkout <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className={buttonClasses("primary", "md", "mt-3 w-full cursor-not-allowed opacity-50")}
                    >
                      Add {formatUSD(remaining)} to checkout
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
