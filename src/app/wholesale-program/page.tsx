import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, TrendingUp, Truck, Headphones, ShieldCheck, Globe } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Wholesale Program",
  description:
    "The RareDexCards wholesale program — tiered bulk pricing, MOQ support, dedicated account managers, and global fulfillment for retailers, distributors, and resellers.",
};

const TIERS = [
  { name: "Starter", who: "New & small shops", detail: "Entry wholesale pricing, low MOQs, mixed cases welcome." },
  { name: "Growth", who: "Established retailers", detail: "Better tier pricing, priority allocation, pre-order access." },
  { name: "Distributor", who: "High-volume & importers", detail: "Best pricing, pallet freight, net terms, dedicated manager." },
];

const FEATURES = [
  { Icon: TrendingUp, title: "Tiered Bulk Pricing", text: "Unit cost drops as your volume grows — automatically." },
  { Icon: Boxes, title: "MOQ Support", text: "Sensible minimums per SKU; mixed cases on many lines." },
  { Icon: Headphones, title: "Account Managers", text: "A dedicated contact for pricing, stock, and logistics." },
  { Icon: Truck, title: "Global Fulfillment", text: "Consolidated freight and tracked courier worldwide." },
  { Icon: ShieldCheck, title: "Authenticity Guaranteed", text: "Sourced through verified channels, every unit." },
  { Icon: Globe, title: "Import/Export Ready", text: "Documentation and support for cross-border orders." },
];

export default function WholesaleProgramPage() {
  return (
    <>
      <PageHero
        eyebrow="Wholesale Program"
        title="Built for volume buyers"
        subtitle="Everything a retailer, distributor, or reseller needs to source authentic Pokémon TCG product in bulk — with pricing and logistics that scale."
      />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, text }) => (
            <RevealItem key={title}>
              <div className="card-premium h-full p-6">
                <div className="inline-flex rounded-xl bg-royal/15 p-2.5 ring-1 ring-royal/25">
                  <Icon className="h-5 w-5 text-royal" />
                </div>
                <h3 className="mt-3 text-base font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-ink">Pricing tiers</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Every account is placed on a tier based on volume. Move up as you
            grow — the more you order, the more you save. Exact pricing is shared
            on quote and after account approval.
          </p>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <div key={t.name} className={`card-premium p-6 ${i === 2 ? "ring-gradient" : ""}`}>
              <p className="text-xs font-bold uppercase tracking-wider text-gold">{t.name}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{t.who}</p>
              <p className="mt-2 text-sm text-muted">{t.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-2xl font-extrabold text-ink">Apply once. Buy at wholesale forever.</h2>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/become-a-dealer" className={buttonClasses("primary", "lg")}>Become a Dealer</Link>
          <Link href="/request-a-quote" className={buttonClasses("outline", "lg")}>Request a Quote</Link>
        </div>
      </section>
    </>
  );
}
