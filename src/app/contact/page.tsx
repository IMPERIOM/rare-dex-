import type { Metadata } from "next";
import { MessageCircle, Mail, Clock, Warehouse, Globe, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/format";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact Sales",
  description:
    "Contact the RareDexCards wholesale team — WhatsApp, email, and our B2B inquiry form. Global fulfillment, fast replies.",
};

const inputCls =
  "w-full rounded-lg border border-line-strong bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-royal";

const REGIONS = [
  "North America", "United Kingdom", "European Union", "Middle East",
  "Southeast Asia", "Australia & NZ", "Japan & East Asia", "Latin America",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to our wholesale team"
        subtitle="Quotes, stock checks, freight, or account questions — reach us the way that suits you. We reply fast during business hours."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="card-premium flex items-center gap-4 p-5">
            <MessageCircle className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="text-sm font-bold text-ink">WhatsApp (fastest)</p>
              <p className="text-sm text-muted">{SITE.whatsapp}</p>
            </div>
          </a>
          <a href={`mailto:${SITE.email}`} className="card-premium flex items-center gap-4 p-5">
            <Mail className="h-6 w-6 text-royal" />
            <div>
              <p className="text-sm font-bold text-ink">Email</p>
              <p className="text-sm text-muted">{SITE.email}</p>
            </div>
          </a>
          <div className="card-premium flex items-center gap-4 p-5">
            <Phone className="h-6 w-6 text-royal" />
            <div>
              <p className="text-sm font-bold text-ink">Phone</p>
              <p className="text-sm text-muted">{SITE.phone}</p>
            </div>
          </div>
          <div className="card-premium flex items-center gap-4 p-5">
            <Clock className="h-6 w-6 text-gold" />
            <div>
              <p className="text-sm font-bold text-ink">Business hours</p>
              <p className="text-sm text-muted">{SITE.hours}</p>
            </div>
          </div>
          <div className="card-premium flex items-center gap-4 p-5">
            <Warehouse className="h-6 w-6 text-gold" />
            <div>
              <p className="text-sm font-bold text-ink">Warehousing</p>
              <p className="text-sm text-muted">{SITE.warehouse}</p>
            </div>
          </div>
          <div className="card-premium p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              <Globe className="h-5 w-5 text-royal" /> We ship to
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {REGIONS.map((r) => (
                <span key={r} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <form className="card-premium h-fit p-6">
          <h2 className="text-lg font-extrabold text-ink">Send us a message</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input required placeholder="Company name" className={inputCls} />
            <input required placeholder="Your name" className={inputCls} />
            <input required type="email" placeholder="Business email" className={inputCls} />
            <input placeholder="Phone / WhatsApp" className={inputCls} />
          </div>
          <input placeholder="Subject" className={`${inputCls} mt-3`} />
          <textarea rows={5} placeholder="How can we help?" className={`${inputCls} mt-3`} />
          <button type="submit" className={buttonClasses("primary", "lg", "mt-4 w-full")}>
            Send message
          </button>
          <p className="mt-3 text-center text-xs text-faint">
            Prefer to talk now? Message us on WhatsApp for the fastest reply.
          </p>
        </form>
      </div>
    </>
  );
}
