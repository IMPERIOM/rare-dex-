# RareDexCards.com

Conversion-optimized storefront for an independent Pokémon trading-card retailer —
booster boxes, ETBs, singles, graded slabs, bulk lots, bundles, and accessories.

> **Compliance:** RareDexCards.com is an independent retailer and is **not**
> affiliated with, sponsored by, or endorsed by Nintendo, Game Freak, or The
> Pokémon Company. The site uses no official logos, mascots, fonts, or
> trademarked assets. The required disclaimer appears in the footer and on
> `/legal/disclaimer`.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-based `@theme` tokens) |
| Fonts | Inter (via `next/font`) |
| State | React Context cart (persisted to `localStorage`) |
| Backend (planned) | Supabase (Postgres) for catalog, inventory, orders |
| Payments (planned) | Stripe + PayPal |
| Auth (planned) | NextAuth.js / Clerk (email + Google) |
| Hosting (planned) | Vercel + Supabase |

## Current status — Milestone 1 (frontend foundation)

This milestone is a **fully clickable frontend on mock data**. Everything renders,
the catalog filters/sorts, and the cart + checkout flow works end-to-end
(checkout is simulated — no payment is processed and no card data is collected).

### Implemented

- Design system with brand tokens (Royal Blue, Gold, White, Charcoal), badges,
  soft shadows, rounded corners — see `src/app/globals.css`.
- Pages: Home, Shop/Catalog, Product Detail, Graded Cards, Bulk/Wholesale,
  About, Shipping & Returns/FAQ, Contact, Cart & Checkout, Account, and Legal
  (Privacy, Terms, Disclaimer).
- Catalog filtering (category, set, rarity, condition, language, price, grade,
  in-stock) and sorting (popularity, newest, price).
- Persistent cart drawer + full cart/checkout page with shipping tiers.
- SEO: per-page metadata, `Product` JSON-LD on PDPs, `sitemap.xml`, `robots.txt`.
- Accessibility: skip link, keyboard focus styles, semantic landmarks, alt/aria labels.
- Mobile-first responsive layout throughout.

### Deferred (need external accounts / credentials)

- Real Supabase schema, data, and inventory sync
- Stripe / PayPal payment processing (Stripe Radar for AVS/CVV)
- NextAuth/Clerk authentication
- Algolia (or Postgres FTS) search backend
- Transactional email (Resend/Postmark), analytics (GA4 / Meta Pixel)
- Product photography on a CDN (Cloudinary or S3 + CloudFront)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm start        # serve the production build
```

## Project structure

```
src/
  app/                     # App Router pages & routes
    layout.tsx             # Root layout: Inter font, CartProvider, Header, Footer
    page.tsx               # Home
    shop/ graded/          # Catalog (shared <Catalog/>)
    product/[slug]/        # Product detail (SSG + Product JSON-LD)
    bulk/ about/ contact/  # Marketing / info pages
    shipping-returns/      # Shipping, returns, authenticity, FAQ (anchored)
    account/ cart/         # Dashboard, cart & checkout
    legal/{privacy,terms,disclaimer}/
    sitemap.ts robots.ts
  components/              # Header, Footer, CartDrawer, ProductCard, Badge, …
  lib/
    types.ts               # Domain types (mirror the planned Supabase schema)
    products.ts            # MOCK catalog + query helpers (swap for API later)
    cart-context.tsx       # Cart state + persistence
    format.ts              # Money formatting + SITE constants
```

## Managing products (until the CMS/Supabase backend lands)

Products live in [`src/lib/products.ts`](src/lib/products.ts) as an array of
`Product` objects (typed in [`src/lib/types.ts`](src/lib/types.ts)).

- **Add a product:** append a new object with a unique `id` and `slug`. The
  home page, catalog, filters, sitemap, and static product pages pick it up
  automatically.
- **Edit stock/price:** change `stock` / `price` (`compareAtPrice` shows a strike-
  through "sale" price).
- **Badges:** set `isNew`, `isBulkDeal`, or add a `grading` object to surface the
  New Arrival / Bulk Deal / graded badges.
- **Artwork:** each product has an `art` gradient tile so the store is
  trademark-safe with zero images. To use real photos later, replace `<CardArt/>`
  in `ProductCard`, `ProductGallery`, and `CartDrawer` with `next/image`.

When the backend is ready, replace the helper functions in `products.ts`
(`getProductBySlug`, `getFeatured`, etc.) with Supabase queries — the component
layer already consumes them and won't need changes.

## Next steps

1. Model the Supabase schema (products, variants, inventory, orders, accounts).
2. Wire Stripe + PayPal checkout (replace the simulated checkout in `app/cart`).
3. Add NextAuth/Clerk and connect the account dashboard to real orders.
4. Swap mock artwork for CDN-hosted photography.
5. Add analytics + transactional email and deploy to Vercel.
