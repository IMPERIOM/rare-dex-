import {
  ShieldCheck,
  Globe,
  Lock,
  Truck,
  UserCog,
  Percent,
  Tag,
  BadgeCheck,
} from "lucide-react";
import { RevealGroup, RevealItem } from "./motion";

const ITEMS = [
  { Icon: ShieldCheck, title: "Authentic Products", text: "Every unit sourced through verified channels." },
  { Icon: Globe, title: "Worldwide Shipping", text: "Fast freight & courier to 40+ countries." },
  { Icon: Lock, title: "Secure Payments", text: "Wire, card & escrow options for dealers." },
  { Icon: Truck, title: "Fast Fulfillment", text: "Same/next-day dispatch on stocked lines." },
  { Icon: UserCog, title: "Dedicated Account Managers", text: "A real person for your account." },
  { Icon: Percent, title: "Bulk Discounts", text: "Tiered pricing that scales with volume." },
  { Icon: Tag, title: "Wholesale Pricing", text: "True dealer cost — not retail markup." },
  { Icon: BadgeCheck, title: "Verified Supplier", text: "Trusted by shops & distributors globally." },
];

export function TrustSection() {
  return (
    <RevealGroup className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {ITEMS.map(({ Icon, title, text }) => (
        <RevealItem key={title}>
          <div className="glass h-full rounded-2xl p-5 transition hover:bg-white/[0.07]">
            <div className="inline-flex rounded-xl bg-royal/15 p-2.5 ring-1 ring-royal/25">
              <Icon className="h-5 w-5 text-royal" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-ink">{title}</h3>
            <p className="mt-1 text-xs text-muted">{text}</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
