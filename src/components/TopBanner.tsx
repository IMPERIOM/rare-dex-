"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Truck, Globe, BadgeCheck, Percent } from "lucide-react";

const MESSAGES = [
  { icon: Truck, text: "FREE shipping on every order — $500 minimum order value" },
  { icon: BadgeCheck, text: "100% authentic, verified Pokémon TCG product — guaranteed" },
  { icon: Percent, text: "Wholesale pricing · the more you order, the more you save" },
  { icon: Globe, text: "Fast, tracked delivery to 40+ countries worldwide" },
];

export function TopBanner() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  const Active = MESSAGES[i].icon;

  return (
    <div className="relative z-50 overflow-hidden border-b border-line bg-gradient-to-r from-royal-deep via-violet/40 to-royal-deep">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex items-center gap-2 text-[12.5px] font-medium text-white/90"
          >
            <Active className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>{MESSAGES[i].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
