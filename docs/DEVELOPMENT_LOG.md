# RareDexCards.com — Development Log

A chronological record of build decisions, work completed, verification, and
outstanding items. Newest entries first.

- **Project:** RareDexCards.com — e-commerce storefront for authentic Pokémon trading cards
- **Repository root:** `C:\Users\lemur\Desktop\RareDexCards`
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- **Status legend:** ✅ done · 🔨 in progress · ⏳ deferred (needs external accounts/keys)

---

## 2026-07-29 — Milestone 1: Frontend foundation

**Owner:** Engineering
**Objective:** Stand up a fully clickable storefront on mock data — complete
page structure, brand design system, reusable components, and a working
catalog + cart — as the foundation for later backend, payments, and auth work.

### Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Commerce backend | **Custom + Supabase (Postgres)** | Full control, no monthly platform fee; Supabase tooling already available. Chosen over Shopify Storefront API. |
| First milestone | **Full frontend scaffold on mock data** | Delivers a clickable, reviewable product immediately; backend/payments layer in without rework. |
| Data layer shape | Typed `Product` model + query helpers | `src/lib/products.ts` helpers mirror intended Supabase queries so the swap is drop-in. |
| Card imagery | Generated gradient tiles (`<CardArt/>`) | Trademark-safe out of the box — zero copyrighted imagery until real photography is added. |
| Cart | React Context + `localStorage` | No backend dependency for milestone 1; persists across navigation and reloads. |
| Checkout | Simulated confirmation | No payment processed and no card data collected until Stripe/PayPal keys exist. |

### Work completed ✅

**Tooling & scaffold**
- Scaffolded Next.js 16 + TypeScript + Tailwind v4 (`src` dir, App Router, import alias `@/*`).
- Renamed package to `raredexcards`; added `.claude/launch.json` dev config.

**Design system** (`src/app/globals.css`)
- Brand tokens: Royal Blue `#2563EB`, Gold `#FBBF24`, White, Charcoal `#1F2937`.
- Inter typeface via `next/font`; subtle radii and soft-shadow tokens.
- Accessibility helpers: focus-visible ring, screen-reader-only utility, skip link.

**Components** (`src/components/`)
- `Header` (search, mega-nav, mobile menu, cart button with live count)
- `CartDrawer`, `Footer` (with required trademark disclaimer)
- `ProductCard`, `CardArt`, `Badge`/`ProductBadges`, `StarRating`
- `AddToCartButton`, `BuyBox` (quantity stepper), `ProductGallery` (zoom)
- `Catalog` (filter + sort engine), `CategoryTiles`, `TrustBar`, `Testimonials`,
  `SectionHeading`, `PageHero`, `LegalPage`

**Pages / routes** (`src/app/`)
- Home, Shop, Graded, Product detail (`/product/[slug]`, SSG + `Product` JSON-LD)
- Bulk/Wholesale (tiered pricing + application form), About, Contact
- Shipping & Returns / FAQ (anchored `#authenticity`, `#faq`)
- Cart & checkout, Account dashboard, Legal (Privacy / Terms / Disclaimer)
- `sitemap.ts`, `robots.ts`, custom `not-found.tsx`

**Catalog & cart functionality**
- 17 mock products across all 8 categories.
- Filtering: category, set, rarity, condition, language, price, grade, in-stock.
- Sorting: most popular, newest, price asc/desc. Deep-linkable (`?category=`, `?q=`, `?sort=`).
- Persistent cart drawer + full cart/checkout with shipping tiers and free-shipping threshold.

**SEO & accessibility**
- Per-page metadata, Open Graph, `Product` structured data on PDPs.
- `sitemap.xml` + `robots.txt`. Semantic landmarks, alt/aria labels, keyboard focus states.

**Compliance**
- No official logos, mascots, fonts, or copyrighted card imagery.
- Trademark disclaimer in footer and on `/legal/disclaimer`.
- Copy uses "authentic Pokémon trading cards" — no implied official partnership.

### Verification

- `npm run build` — ✅ compiled successfully, TypeScript passed, 34 routes generated (18 static product pages via `generateStaticParams`).
- Live browser check on `http://localhost:3000` — home, shop (`?category=graded`), category tiles, product cards, cart drawer all render correctly.
- Cart state persists across navigation (header count).
- Console: **no errors**.

### Issues found & fixed

- **Horizontal scrollbar on all pages** — the closed cart drawer (`translate-x-full`) extended past the viewport and stretched document width. Fixed by adding `overflow-hidden` to the drawer's fixed container (`src/components/CartDrawer.tsx`). Re-verified: `scrollWidth === clientWidth`.

### Deferred to later milestones ⏳

Each requires external accounts, credentials, or keys that only the owner can provision.

- Supabase schema, seed data, and real-time inventory sync
- Stripe + PayPal payment processing (Stripe Radar AVS/CVV)
- Authentication (NextAuth.js / Clerk — email + Google)
- Search backend (Algolia or Postgres full-text search)
- Transactional email (Resend / Postmark)
- Analytics (GA4 / Meta Pixel)
- Product photography on a CDN (Cloudinary or S3 + CloudFront)
- Production deploy (Vercel + managed Supabase)

### Next steps (proposed)

1. Design the Supabase data model (products, variants, inventory, orders, accounts) and seed real data; swap the mock query helpers.
2. Wire Stripe + PayPal checkout in place of the simulated flow.
3. Add auth and connect the account dashboard to real orders.
4. Replace placeholder art with CDN-hosted photography.
5. Add analytics + transactional email; deploy to Vercel.

---

## Template for future entries

```
## YYYY-MM-DD — <Milestone / topic>

**Owner:**
**Objective:**

### Work completed
### Verification
### Issues found & fixed
### Next steps
```
