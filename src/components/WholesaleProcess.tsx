"use client";

import { motion } from "framer-motion";
import { FileText, ClipboardCheck, BadgeCheck, Truck } from "lucide-react";

const STEPS = [
  { Icon: FileText, title: "Request Pricing", text: "Send us your product list and target quantities — no account required." },
  { Icon: ClipboardCheck, title: "Receive Custom Quote", text: "A dedicated manager replies with dealer pricing, stock & freight within 24 hours." },
  { Icon: BadgeCheck, title: "Approve Order", text: "Confirm your quote and pay securely by your preferred method." },
  { Icon: Truck, title: "Worldwide Delivery", text: "We pack, insure, and ship — tracked to your door in 40+ countries." },
];

export function WholesaleProcess() {
  return (
    <div className="relative">
      {/* connecting line */}
      <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-royal/40 to-transparent lg:block" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-center"
          >
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-line-strong bg-gradient-to-br from-royal/20 to-violet/20 backdrop-blur">
              <s.Icon className="h-6 w-6 text-royal" />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-royal to-violet text-xs font-bold text-white">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
