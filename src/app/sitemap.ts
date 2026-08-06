import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { SITE } from "@/lib/format";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
    "/graded",
    "/new-arrivals",
    "/clearance",
    "/brands",
    "/wholesale-program",
    "/become-a-dealer",
    "/request-a-quote",
    "/about",
    "/contact",
    "/faqs",
    "/shipping",
    "/returns",
    "/legal/privacy",
    "/legal/terms",
    "/legal/disclaimer",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE.url}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
