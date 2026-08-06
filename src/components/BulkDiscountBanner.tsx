import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "./ui/Button";
import { Reveal, RevealGroup, RevealItem } from "./motion";

const TIERS = [
  { spend: "$2,500+", save: "Save 5%", tone: "from-royal to-blue-500" },
  { spend: "$5,000+", save: "Save 10%", tone: "from-violet to-fuchsia-500" },
  { spend: "$10,000+", save: "Save 15%", tone: "from-fuchsia-500 to-pink-500" },
  { spend: "$25,000+", save: "Custom Pricing", tone: "from-gold to-amber-500" },
];

export function BulkDiscountBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line">
      {/* animated gradient + rays backdrop */}
      <div className="absolute inset-0 [background:linear-gradient(120deg,#1e3a8a,#4c1d95,#6d28d9,#1e3a8a)] [background-size:300%_300%] [animation:foil-pan_10s_linear_infinite] opacity-90" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute -left-10 top-0 h-full w-40 rotate-12 bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-0 h-full w-24 -rotate-12 bg-cyan-300/10 blur-2xl" />

      <div className="relative px-6 py-12 sm:px-10">
        <Reveal>
          <div className="text-center">
            <h2 className="text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
              BUY MORE.<br />
              <span className="text-gold-gradient">SAVE MORE.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
              Exclusive volume pricing for retailers and distributors — the bigger
              your order, the deeper your discount.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
          {TIERS.map((t) => (
            <RevealItem key={t.spend}>
              <div className="holo group rounded-2xl border border-white/15 bg-black/30 p-5 text-center backdrop-blur-sm transition hover:-translate-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Spend</p>
                <p className="mt-1 text-xl font-black text-white">{t.spend}</p>
                <p className={`mt-3 bg-gradient-to-r ${t.tone} bg-clip-text text-lg font-extrabold text-transparent`}>
                  {t.save}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-9 flex justify-center">
          <Link href="/request-a-quote" className={buttonClasses("gold", "lg", "shadow-[0_0_30px_-4px_#fbbf24aa]")}>
            Request Wholesale Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
