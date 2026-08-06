import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, Package, Globe } from "lucide-react";
import { getProductBySlug, getRelated, products, priceOf } from "@/lib/products";
import { CONDITION_LABELS, AVAILABILITY_LABELS } from "@/lib/types";
import { SITE, formatUSD } from "@/lib/format";
import { ProductGallery } from "@/components/ProductGallery";
import { BuyBox } from "@/components/BuyBox";
import { ProductBadges } from "@/components/Badge";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelated(product, 4);
  const inStock = product.availability !== "backorder";

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    category: product.category,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: priceOf(product),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/BackOrder",
      url: `${SITE.url}/product/${product.slug}`,
    },
  };

  const specs: [string, string][] = [
    ["SKU", product.sku],
    ["Brand / Line", product.brand],
    ["Set", product.set],
    ["Case Quantity", product.caseQty],
    ["Minimum Order (MOQ)", `${product.moq}`],
    ["Language", product.language],
    ["Rarity", product.rarity],
    ...(product.condition
      ? ([["Condition", `${CONDITION_LABELS[product.condition]} (${product.condition})`]] as [string, string][])
      : []),
    ...(product.grading
      ? ([
          ["Grade", `${product.grading.company} ${product.grading.grade}`],
          ["Certification #", product.grading.certNumber],
        ] as [string, string][])
      : []),
    ["Availability", AVAILABILITY_LABELS[product.availability]],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-xs text-faint" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-royal">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-royal">Catalog</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />

        <div>
          <ProductBadges product={product} />
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-royal">
            {product.brand}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-black text-ink">{formatUSD(priceOf(product))}</span>
            <span className="text-sm text-faint">per unit · {product.caseQty}</span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <Truck className="h-3.5 w-3.5" /> Ships FREE · ${SITE.minOrder} minimum order value
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 ring-1 ring-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-semibold">Authenticity Guaranteed</span>
            <span className="text-emerald-300/70">— verified before it ships</span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {specs.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-faint">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7">
            <BuyBox productId={product.id} moq={product.moq} />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            {product.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted sm:grid-cols-4">
            <span className="flex items-center gap-1.5"><Package className="h-4 w-4 text-royal" /> Case-ready</span>
            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-royal" /> Fast dispatch</span>
            <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-royal" /> Global freight</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-royal" /> Authentic</span>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <SectionHeading eyebrow="Related lines" title="You might also stock" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
