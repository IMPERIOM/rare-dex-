import Link from "next/link";
import { Camera, AtSign, ThumbsUp, Briefcase, Mail, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/format";
import { Logo } from "./Logo";
import { buttonClasses } from "./ui/Button";

const COLUMNS = [
  {
    title: "Wholesale",
    links: [
      { label: "Wholesale Program", href: "/wholesale-program" },
      { label: "Become a Dealer", href: "/become-a-dealer" },
      { label: "Request a Quote", href: "/request-a-quote" },
      { label: "Product Catalog", href: "/shop" },
      { label: "Brands", href: "/brands" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Shipping Information", href: "/shipping" },
      { label: "Returns Policy", href: "/returns" },
      { label: "Request a Quote", href: "/request-a-quote" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Clearance", href: "/clearance" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms & Conditions", href: "/legal/terms" },
    ],
  },
];

const SOCIAL = [
  { Icon: Camera, href: SITE.social.instagram, label: "Instagram" },
  { Icon: AtSign, href: SITE.social.x, label: "X" },
  { Icon: ThumbsUp, href: SITE.social.facebook, label: "Facebook" },
  { Icon: Briefcase, href: SITE.social.linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-line bg-base-2">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr_1.4fr]">
          {/* Brand + newsletter */}
          <div>
            <Logo tone="light" size={104} />
            <p className="mt-4 max-w-xs text-sm text-muted">{SITE.blurb}</p>
            <div className="mt-5 flex gap-2">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-lg border border-line p-2 text-muted transition hover:border-white/25 hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-faint">
                  {col.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted transition hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter + contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-faint">
              Dealer Newsletter
            </h3>
            <p className="mt-3 text-sm text-muted">
              New allocations, restocks &amp; wholesale deals — straight to your
              inbox.
            </p>
            <form className="mt-3 flex gap-2">
              <input
                type="email"
                required
                placeholder="you@business.com"
                aria-label="Email address"
                className="w-full rounded-lg border border-line-strong bg-white/[0.03] px-3 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-royal"
              />
              <button type="submit" className={buttonClasses("primary", "sm")}>
                Join
              </button>
            </form>
            <div className="mt-5 space-y-2 text-sm text-muted">
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-ink">
                <Mail className="h-4 w-4 text-royal" /> {SITE.email}
              </a>
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ink">
                <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp: {SITE.whatsapp}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-faint">{SITE.disclaimer}</p>
          <p className="mt-3 text-xs text-faint">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved. ·
            Global B2B Pokémon TCG wholesale distributor.
          </p>
        </div>
      </div>
    </footer>
  );
}
