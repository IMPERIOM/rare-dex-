"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Globe, Boxes, ShieldCheck, Clock, Truck } from "lucide-react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

const STATS = [
  { Icon: Globe, value: 40, suffix: "+", label: "Countries Served" },
  { Icon: Boxes, value: 1000, suffix: "+", label: "Wholesale Products" },
  { Icon: ShieldCheck, value: 100, suffix: "%", label: "Authentic" },
  { Icon: Clock, value: 24, suffix: "h", label: "Order Processing" },
  { Icon: Truck, text: "Worldwide", label: "Shipping" },
];

export function StatsBar() {
  return (
    <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-3 lg:grid-cols-5">
      {STATS.map(({ Icon, value, suffix, text, label }) => (
        <div key={label} className="flex flex-col items-center gap-1 bg-white/[0.015] px-4 py-6 text-center">
          <Icon className="h-5 w-5 text-royal" />
          <p className="mt-1 text-2xl font-black text-ink sm:text-3xl">
            {text ? <span className="foil-text">{text}</span> : <Counter to={value!} suffix={suffix} />}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-faint">{label}</p>
        </div>
      ))}
    </div>
  );
}
