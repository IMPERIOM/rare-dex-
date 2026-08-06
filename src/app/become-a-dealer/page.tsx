"use client";

import { useState } from "react";
import { CheckCircle2, UserPlus } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/motion";

const inputCls =
  "w-full rounded-lg border border-line-strong bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-royal";

const PERKS = [
  "Tiered wholesale pricing across all 14 categories",
  "Dedicated account manager & priority allocation",
  "Early access to pre-orders and new releases",
  "Volume discounts that scale toward pallet orders",
  "Net terms available for established accounts",
  "Consolidated global freight & tracked shipping",
];

export default function BecomeDealerPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Wholesale Accounts"
        title="Become a Wholesale Customer"
        subtitle="Apply for a dealer account to unlock wholesale pricing. We work with retail stores, online shops, card shops, distributors, importers, resellers, and collectible businesses."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="text-xl font-extrabold text-ink">Why open an account?</h2>
            <ul className="mt-5 space-y-3">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-muted">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-line bg-white/[0.03] p-5">
              <p className="text-sm font-semibold text-ink">How approval works</p>
              <ol className="mt-2 space-y-1.5 text-sm text-muted [counter-reset:step] [&_li]:before:mr-2 [&_li]:before:font-bold [&_li]:before:text-royal [&_li]:before:[counter-increment:step] [&_li]:before:[content:counter(step)'.']">
                <li>Submit the application with your business details.</li>
                <li>We verify your business (usually within 1 business day).</li>
                <li>You&apos;re approved and dealer pricing unlocks on login.</li>
              </ol>
            </div>
          </div>
        </Reveal>

        {sent ? (
          <div className="card-premium flex flex-col items-center justify-center p-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-400" />
            <h2 className="mt-4 text-xl font-bold text-ink">Application received</h2>
            <p className="mt-2 text-sm text-muted">
              Thanks! Our team will review your details and follow up by email to
              activate your wholesale account.
            </p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="card-premium h-fit p-6">
            <h2 className="text-lg font-extrabold text-ink">Dealer application</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input required placeholder="Legal business name" className={inputCls} />
              <input required placeholder="Trading name" className={inputCls} />
              <input required type="email" placeholder="Business email" className={inputCls} />
              <input placeholder="Phone / WhatsApp" className={inputCls} />
              <input placeholder="Country" className={inputCls} />
              <input placeholder="Tax / VAT / reseller ID" className={inputCls} />
              <select className={`${inputCls} sm:col-span-2`} defaultValue="">
                <option value="" disabled>Business type…</option>
                <option>Retail store</option>
                <option>Online shop</option>
                <option>Card shop</option>
                <option>Distributor</option>
                <option>Reseller</option>
                <option>Importer</option>
                <option>Collectible business</option>
              </select>
            </div>
            <textarea rows={3} placeholder="Tell us about your business & typical monthly volume…" className={`${inputCls} mt-3`} />
            <button type="submit" className={buttonClasses("primary", "lg", "mt-4 w-full")}>
              <UserPlus className="h-4 w-4" /> Apply for Wholesale Account
            </button>
          </form>
        )}
      </div>
    </>
  );
}
