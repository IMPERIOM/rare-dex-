import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/format";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How RareDexCards collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 29, 2026">
      <p>
        This Privacy Policy explains how {SITE.name} (&quot;we,&quot;
        &quot;us&quot;) collects, uses, and safeguards your information when you
        use {SITE.domain}. By using the site you agree to the practices described
        here.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Contact and account details (name, email, shipping address).</li>
        <li>Order information (items purchased, order history).</li>
        <li>
          Payment information is processed securely by our payment providers
          (Stripe, PayPal). We do not store full card numbers on our servers.
        </li>
        <li>
          Usage data such as pages viewed and device/browser information,
          collected via analytics tools.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To process and ship your orders and provide customer support.</li>
        <li>To send order confirmations, shipping updates, and, with your consent, marketing emails.</li>
        <li>To detect and prevent fraud and to improve our store.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We share information only with service providers who help us operate the
        store (payment processing, shipping, email, analytics) and when required
        by law. We do not sell your personal information.
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential cookies to run the cart and checkout, and optional
        analytics/marketing cookies. You can control non-essential cookies
        through your browser or our cookie settings.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or
        delete your personal data, and to opt out of marketing. Contact us at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> to exercise these
        rights.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
