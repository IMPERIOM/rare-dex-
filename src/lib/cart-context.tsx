"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine } from "./types";
import { getProductById, priceOf } from "./products";

const STORAGE_KEY = "raredex.cart.v1";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  bump: number; // increments on each add — drives the add-to-cart animation
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines, hydrated]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      const nextQty = (existing?.quantity ?? 0) + quantity;
      const capped = Math.min(nextQty, product.stock);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: capped } : l,
        );
      }
      return [...prev, { productId, quantity: Math.max(1, capped) }];
    });
    setBump((b) => b + 1);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const product = getProductById(productId);
    const max = product?.stock ?? quantity;
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.min(quantity, max) }
              : l,
          ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of lines) {
      const p = getProductById(line.productId);
      if (!p) continue;
      count += line.quantity;
      subtotal += priceOf(p) * line.quantity;
    }
    return { count, subtotal };
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      bump,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [lines, count, subtotal, bump, isOpen, addItem, removeItem, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
