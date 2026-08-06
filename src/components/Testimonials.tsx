"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const REVIEWS = [
  { name: "Marcus T.", role: "Card Shop Owner · Texas", text: "Best wholesale partner we've worked with. Sealed product is always authentic and the volume pricing genuinely beats our old distributor." },
  { name: "Dana R.", role: "Online Reseller · UK", text: "Fast processing and the free shipping over $500 makes reordering effortless. My margins improved the month I switched to Rare DEX." },
  { name: "Kevin L.", role: "Distributor · Singapore", text: "Priority stock allocation on new drops is a game-changer. Their account manager actually picks up the phone." },
  { name: "Sofia M.", role: "Investor · Canada", text: "Graded lots arrive exactly as described with verifiable certs. This is the level of trust bulk buying should have." },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const perView = 2;

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + perView) % REVIEWS.length), 4500);
    return () => clearInterval(id);
  }, []);

  const shown = [REVIEWS[i % REVIEWS.length], REVIEWS[(i + 1) % REVIEWS.length]];

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5 }}
          className="grid gap-5 md:grid-cols-2"
        >
          {shown.map((r) => (
            <figure key={r.name} className="glass relative rounded-2xl p-6">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-white/10" />
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-muted">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-royal to-violet text-xs font-bold text-white ring-2 ring-white/10">
                  {initials(r.name)}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{r.name}</p>
                  <p className="text-xs text-faint">{r.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex justify-center gap-1.5">
        {Array.from({ length: Math.ceil(REVIEWS.length / perView) }).map((_, d) => (
          <button
            key={d}
            onClick={() => setI(d * perView)}
            className={`h-1.5 rounded-full transition-all ${Math.floor(i / perView) === d ? "w-6 bg-royal" : "w-1.5 bg-white/20"}`}
            aria-label={`Testimonial group ${d + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
