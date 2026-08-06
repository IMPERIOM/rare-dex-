import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Wholesale FAQs",
  description:
    "Answers to common wholesale questions — minimum orders, pricing, shipping, authenticity, payment, and dealer accounts.",
};

const FAQS = [
  { q: "Do you sell to the public / at retail?", a: "No. RareDexCards is a B2B wholesale supplier. We sell in bulk quantities to retail stores, online shops, card shops, distributors, importers, and resellers only." },
  { q: "How do I see pricing?", a: "Pricing is quote-based. Add products to a quote and submit a request, or apply for a dealer account to view live tiered pricing after approval." },
  { q: "What is your minimum order?", a: "Minimums are set per SKU (shown as MOQ on each product). Many lines allow mixed cases. Larger volumes unlock better tier pricing up toward pallet quantities." },
  { q: "Are your products authentic?", a: "Yes — 100%. Every unit is sourced through verified distribution channels and inspected before dispatch. Authenticity is guaranteed on every order." },
  { q: "Do you offer free shipping?", a: "Yes — free worldwide shipping on wholesale orders over $1,000 USD. Freight for larger palletized orders is quoted per destination." },
  { q: "Which payment methods do you accept?", a: "Bank wire and card for most accounts, with escrow options and net terms available for established dealers." },
  { q: "Do you ship internationally?", a: "Yes. We fulfill from US, EU, and Asia hubs and ship to 40+ countries with tracked courier and consolidated freight." },
  { q: "How fast do you reply to quotes?", a: "Usually within one business day. For urgent requests, message us on WhatsApp for the fastest response." },
];

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Wholesale FAQs"
        subtitle="Common questions about ordering, pricing, shipping, and dealer accounts."
      />

      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="card-premium group p-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold text-ink">
                {f.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Still have questions?{" "}
          <Link href="/contact" className="text-royal hover:underline">Contact our team</Link>.
        </p>
      </div>
    </>
  );
}
