import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { buttonClasses } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "RareDexCards is a global B2B Pokémon TCG wholesale distributor supplying authentic product in bulk to retailers, distributors, and resellers worldwide.",
};

const VALUES = [
  { icon: "🛡️", title: "Authenticity First", text: "Every unit is sourced through verified channels and inspected before it ships." },
  { icon: "🌍", title: "Global Reach", text: "Fulfillment hubs in the US, EU, and Asia serving dealers in 40+ countries." },
  { icon: "🤝", title: "Partner Mindset", text: "Dedicated account managers who help your business grow, not just close a sale." },
  { icon: "📦", title: "Built for Volume", text: "Case-ready logistics, tiered pricing, and pallet freight when you scale." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A global Pokémon wholesale partner"
        subtitle="RareDexCards exists to make sourcing authentic Pokémon TCG product simple, reliable, and profitable for businesses of every size."
      />

      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="card-back-pattern mb-8 flex aspect-[12/5] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-royal-deep to-violet/60 shadow-[var(--shadow-lift)]">
          <span className="foil-text text-3xl font-black">Built by collectors</span>
        </div>
        <h2 className="text-2xl font-extrabold text-ink">Our story</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
          <p>
            We started on the retail side of the counter — so we know exactly
            what shops, online sellers, and distributors need from a supplier:
            authentic product, honest pricing, dependable stock, and someone who
            actually picks up the phone.
          </p>
          <p>
            Today RareDexCards supplies sealed cases, ETBs, premium collections,
            graded lots, Japanese imports, accessories, and more — in bulk, to
            businesses across 40+ countries. Every unit is verified authentic,
            and every account gets a dedicated manager.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-14">
        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <RevealItem key={v.title}>
              <div className="card-premium flex gap-4 p-6">
                <span className="text-3xl">{v.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-ink">{v.title}</h3>
                  <p className="mt-1 text-sm text-muted">{v.text}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 text-center">
        <h2 className="text-2xl font-extrabold text-ink">Let&apos;s do business</h2>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/become-a-dealer" className={buttonClasses("primary", "lg")}>Become a Dealer</Link>
          <Link href="/contact" className={buttonClasses("outline", "lg")}>Contact Us</Link>
        </div>
      </section>
    </>
  );
}
