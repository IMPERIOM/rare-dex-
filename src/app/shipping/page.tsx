import type { Metadata } from "next";
import { Truck, Package, Globe, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Shipping Information",
  description:
    "Wholesale shipping — free worldwide shipping over $1,000, palletized freight, tracked courier, and secure packaging on every order.",
};

const POINTS = [
  { Icon: Truck, title: "Free shipping over $1,000", text: "Wholesale orders over $1,000 USD ship free worldwide. Smaller orders are quoted at cost." },
  { Icon: Package, title: "Secure, case-grade packaging", text: "Sealed product is double-boxed and palletized where needed; slabs ship foam-lined and insured." },
  { Icon: Globe, title: "Global fulfillment", text: "Dispatched from US, EU, and Asia hubs to 40+ countries via tracked courier and consolidated freight." },
  { Icon: ShieldCheck, title: "Insured & tracked", text: "Every shipment is fully tracked and insured. Signature on delivery for high-value orders." },
];

export default function ShippingPage() {
  return (
    <>
      <PageHero
        eyebrow="Logistics"
        title="Shipping Information"
        subtitle="How we get authentic product to your door — fast, secure, and worldwide."
      />
      <div className="mx-auto max-w-4xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {POINTS.map(({ Icon, title, text }) => (
            <div key={title} className="card-premium p-6">
              <div className="inline-flex rounded-xl bg-royal/15 p-2.5 ring-1 ring-royal/25">
                <Icon className="h-5 w-5 text-royal" />
              </div>
              <h3 className="mt-3 text-base font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
          <h2 className="text-lg font-bold text-ink">Lead times</h2>
          <p>Stocked lines dispatch within 1–2 business days. Pre-orders ship on release; allocation is confirmed at the time of quote. Palletized freight timelines are quoted per destination and carrier.</p>
          <h2 className="text-lg font-bold text-ink">Customs & duties</h2>
          <p>International orders may be subject to import duties and taxes assessed by the destination country. We provide full documentation to support smooth customs clearance for importers.</p>
        </div>
      </div>
    </>
  );
}
