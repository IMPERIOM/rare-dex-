"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getProductById } from "@/lib/products";
import { SITE } from "@/lib/format";
import { PageHero } from "@/components/PageHero";
import { buttonClasses } from "@/components/ui/Button";
import { CardArt } from "@/components/CardArt";

const inputCls =
  "w-full rounded-lg border border-line-strong bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-royal";

export default function RequestQuotePage() {
  const { lines, setQuantity, removeItem } = useCart();
  const [sent, setSent] = useState(false);

  const items = lines
    .map((l) => ({ line: l, product: getProductById(l.productId) }))
    .filter((x) => x.product);

  if (sent) {
    return (
      <>
        <PageHero eyebrow="Request a Quote" title="Quote request received" />
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
          <h2 className="mt-4 text-xl font-bold text-ink">Thanks — we&apos;re on it.</h2>
          <p className="mt-2 text-sm text-muted">
            Our wholesale team will reply with dealer pricing, availability, and
            freight — usually within one business day. For anything urgent,
            message us on WhatsApp.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("gold", "md")}>
              <MessageCircle className="h-4 w-4" /> WhatsApp Sales
            </a>
            <Link href="/shop" className={buttonClasses("outline", "md")}>
              Back to catalog
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Request Wholesale Pricing"
        subtitle="Tell us what you need and your target quantities. We reply with dealer pricing, stock, and shipping — no obligation."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.1fr]">
        {/* Items */}
        <div>
          <h2 className="text-lg font-extrabold text-ink">Your quote items</h2>
          {items.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
              No items added yet. Browse the{" "}
              <Link href="/shop" className="text-royal hover:underline">catalog</Link>{" "}
              and “Add to Quote”, or just describe your needs in the form.
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {items.map(({ line, product: p }) => (
                <li key={line.productId} className="flex gap-3 rounded-2xl border border-line p-3">
                  <CardArt product={p!} showLabel={false} className="h-16 w-14 shrink-0 rounded-md" />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold text-ink">{p!.name}</span>
                    <span className="text-xs text-faint">{p!.sku} · {p!.caseQty}</span>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-lg border border-line-strong">
                        <button onClick={() => setQuantity(p!.id, line.quantity - 1)} className="px-2.5 py-1 text-muted hover:text-ink" aria-label="Decrease">−</button>
                        <span className="w-8 text-center text-sm text-ink">{line.quantity}</span>
                        <button onClick={() => setQuantity(p!.id, line.quantity + 1)} className="px-2.5 py-1 text-muted hover:text-ink" aria-label="Increase">+</button>
                      </div>
                      <button onClick={() => removeItem(p!.id)} className="text-faint hover:text-red-400" aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="card-premium h-fit p-6"
        >
          <h2 className="text-lg font-extrabold text-ink">Your business details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input required placeholder="Company / store name" className={inputCls} />
            <input required placeholder="Contact name" className={inputCls} />
            <input required type="email" placeholder="Business email" className={inputCls} />
            <input placeholder="Phone / WhatsApp" className={inputCls} />
            <input placeholder="Country" className={inputCls} />
            <select className={inputCls} defaultValue="">
              <option value="" disabled>Business type…</option>
              <option>Retail store</option>
              <option>Online shop</option>
              <option>Card shop</option>
              <option>Distributor</option>
              <option>Reseller</option>
              <option>Importer</option>
              <option>Other</option>
            </select>
          </div>
          <textarea
            rows={4}
            placeholder="Products & target quantities, destination, timeline…"
            className={`${inputCls} mt-3`}
          />
          <button type="submit" className={buttonClasses("primary", "lg", "mt-4 w-full")}>
            <FileText className="h-4 w-4" /> Submit Quote Request
          </button>
          <p className="mt-3 text-center text-xs text-faint">
            No payment is taken. A dedicated account manager replies within one
            business day.
          </p>
        </form>
      </div>
    </>
  );
}
