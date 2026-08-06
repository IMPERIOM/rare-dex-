"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { buttonClasses } from "./ui/Button";
import { cn } from "@/lib/cn";

export function AddToCartButton({
  productId,
  quantity = 1,
  variant = "primary",
  className = "",
  label = "Add to Cart",
}: {
  productId: string;
  quantity?: number;
  variant?: "primary" | "outline";
  className?: string;
  label?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={() => {
        addItem(productId, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1300);
      }}
      className={cn(buttonClasses(variant, "sm"), "relative w-full overflow-hidden", className)}
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.span
            key="added"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> Added to Cart
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" /> {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
