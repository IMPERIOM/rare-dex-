import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/format";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of RareDexCards and purchases made through the store.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 29, 2026">
      <p>
        These Terms of Service govern your access to and use of {SITE.domain} and
        any purchases you make. By using the site, you agree to these terms.
      </p>

      <h2>Orders & pricing</h2>
      <ul>
        <li>All prices are in USD and subject to change without notice.</li>
        <li>
          We make every effort to display accurate stock and pricing, but reserve
          the right to cancel or refuse any order, including for pricing errors or
          suspected fraud.
        </li>
        <li>An order is accepted only when we send an order confirmation.</li>
      </ul>

      <h2>Authenticity</h2>
      <p>
        We sell authentic Pokémon trading cards and stand behind every item with
        our authenticity guarantee. See our{" "}
        <a href="/shipping-returns#authenticity">Authenticity Policy</a> for
        details.
      </p>

      <h2>Shipping & returns</h2>
      <p>
        Shipping times, packaging standards, and our return policy are described
        on the <a href="/shipping-returns">Shipping &amp; Returns</a> page and are
        incorporated into these terms.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the site for unlawful purposes or to infringe others&apos; rights.</li>
        <li>Do not attempt to disrupt, reverse-engineer, or gain unauthorized access to the site.</li>
      </ul>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {SITE.name} is not liable for
        indirect, incidental, or consequential damages arising from your use of
        the site or products purchased through it.
      </p>

      <h2>Trademarks</h2>
      <p>
        {SITE.name} is an independent retailer. See our{" "}
        <a href="/legal/disclaimer">Trademark &amp; Disclaimer</a> page. Pokémon
        and all related trademarks are property of their respective owners.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
