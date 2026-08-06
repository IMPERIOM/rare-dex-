import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Returns Policy",
  description:
    "RareDexCards wholesale returns policy — damage claims, sealed-product handling, and how to open a case with your account manager.",
};

export default function ReturnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Policies"
        title="Returns Policy"
        subtitle="Our wholesale returns and claims process, built around sealed product and dealer accounts."
      />
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-14 text-sm leading-relaxed text-muted">
        <div>
          <h2 className="text-lg font-bold text-ink">Damage & shortage claims</h2>
          <p className="mt-2">Inspect every shipment on arrival. Report any transit damage or shortage within 5 business days of delivery, with photos of the packaging and contents. Approved claims are resolved by replacement, credit, or refund.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Sealed product</h2>
          <p className="mt-2">Because value depends on factory seals, sealed product cannot be returned once opened except in the case of a verified authenticity or fulfillment error on our part. Authenticity is guaranteed on every unit.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Graded cards</h2>
          <p className="mt-2">Graded slabs are covered against misdescription and mis-shipment. Certification numbers are verifiable before purchase; report any discrepancy within 5 business days.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">How to open a claim</h2>
          <p className="mt-2">Contact your account manager or our team via the <Link href="/contact" className="text-royal underline">contact page</Link> or WhatsApp with your quote/order reference and photos. We aim to resolve every claim within 3 business days.</p>
        </div>
      </article>
    </>
  );
}
