import Link from "next/link";
import { ArrowRight, FileText, MessageCircle } from "lucide-react";
import {
  getBestSellers,
  getNewArrivals,
  getClearance,
} from "@/lib/products";
import { SITE } from "@/lib/format";
import { Hero } from "@/components/Hero";
import { HomeCategoryTiles } from "@/components/HomeCategoryTiles";
import { PromoModal } from "@/components/PromoModal";
import { StatsBar } from "@/components/StatsBar";
import { TrustSection } from "@/components/TrustSection";
import { BulkDiscountBanner } from "@/components/BulkDiscountBanner";
import { WholesaleProcess } from "@/components/WholesaleProcess";
import { Testimonials } from "@/components/Testimonials";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/motion";
import { buttonClasses } from "@/components/ui/Button";

export default function HomePage() {
  const bestSellers = getBestSellers(8);
  const newArrivals = getNewArrivals(4);
  const clearance = getClearance(4);

  return (
    <>
      <PromoModal />
      <Hero />

      {/* Animated stats bar */}
      <section className="mx-auto -mt-6 max-w-7xl px-4">
        <StatsBar />
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your next drop"
          linkHref="/shop"
          linkLabel="Full catalog"
        />
        <HomeCategoryTiles />
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <TrustSection />
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHeading
          eyebrow="Moving fast"
          title="Best-Selling Wholesale SKUs"
          linkHref="/shop"
          linkLabel="View all"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Bulk discount tiers */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <BulkDiscountBanner />
      </section>

      {/* Wholesale CTA band */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <Reveal>
          <div className="ring-gradient relative overflow-hidden rounded-3xl p-8 sm:p-12">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet/30 blur-[100px]" />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="max-w-xl text-2xl font-extrabold text-ink sm:text-3xl">
                  Open a wholesale account and unlock{" "}
                  <span className="text-gold-gradient">dealer pricing</span>
                </h2>
                <p className="mt-2 max-w-lg text-sm text-muted">
                  Retailers, online shops, card stores, distributors, importers
                  and resellers — apply once and get tiered bulk pricing across
                  the entire catalog.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link href="/become-a-dealer" className={buttonClasses("primary", "lg")}>
                  Become a Dealer <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("gold", "lg")}
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Sales
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* New arrivals + clearance */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHeading
          eyebrow="Just landed & pre-orders"
          title="New Arrivals"
          linkHref="/new-arrivals"
          linkLabel="All new arrivals"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHeading
          eyebrow="Closeouts & overstock"
          title="Clearance Inventory"
          linkHref="/clearance"
          linkLabel="Shop clearance"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {clearance.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Wholesale process */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHeading eyebrow="How it works" title="From quote to delivery" />
        <WholesaleProcess />
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionHeading eyebrow="Trusted worldwide" title="What buyers say" />
        <Testimonials />
      </section>

      {/* Quote CTA */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Ready to place a bulk order?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Send us your product list and target quantities — our team replies
            with dealer pricing, availability, and freight, usually within one
            business day.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/request-a-quote" className={buttonClasses("primary", "lg")}>
              <FileText className="h-5 w-5" /> Request a Quote
            </Link>
            <Link href="/contact" className={buttonClasses("outline", "lg")}>
              Contact Sales
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
