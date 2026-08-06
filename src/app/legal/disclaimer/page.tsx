import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/format";

export const metadata: Metadata = {
  title: "Trademark & Disclaimer",
  description:
    "RareDexCards is an independent retailer and is not affiliated with, sponsored by, or endorsed by Nintendo, Game Freak, or The Pokémon Company.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage title="Trademark & Disclaimer" updated="July 29, 2026">
      <div className="rounded-[var(--radius-card)] border border-royal-light bg-royal-tint/50 p-5 text-royal-dark">
        <p>
          <strong>{SITE.disclaimer}</strong>
        </p>
      </div>

      <h2>Independent retailer</h2>
      <p>
        RareDexCards.com is an independent retailer of authentic trading cards.
        We are not an official store of, and have no partnership with, Nintendo,
        Game Freak, Creatures Inc., or The Pokémon Company International. Any
        references to &quot;Pokémon&quot; on this site are solely to describe the
        genuine products we sell.
      </p>

      <h2>Trademarks</h2>
      <p>
        &quot;Pokémon,&quot; character names, set names, and all related names,
        marks, emblems, and images are trademarks and/or copyrighted works of
        their respective owners. Their use on this site is for identification and
        descriptive purposes only and does not imply any affiliation with or
        endorsement by the trademark holders.
      </p>

      <h2>Product imagery</h2>
      <p>
        Product photography is used solely to depict the specific authentic items
        offered for sale. We do not use official logos, mascots, fonts, or
        marketing assets in the branding or design of this website.
      </p>

      <h2>Authenticity</h2>
      <p>
        We sell authentic Pokémon trading cards sourced through legitimate
        channels. &quot;Authentic&quot; refers to genuine, non-counterfeit
        product — it does not imply an official partnership with or authorization
        from the trademark holders.
      </p>
    </LegalPage>
  );
}
