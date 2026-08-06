// ------------------------------------------------------------------
// Checkout configuration.
//
// ⚠️ PLACEHOLDER PAYMENT DETAILS ONLY.
// Every recipient value below (Zelle email, bank/account/routing numbers,
// IBAN/BIC, RevTag, PayPal email, crypto wallet addresses) is a DEMO
// placeholder. Replace them with your real details in your server/config
// before going live — never commit real financial credentials to the client
// bundle. No real payment is processed by this UI.
// ------------------------------------------------------------------

export type Region = "us" | "eu" | "other";

export type PaymentMethodId =
  | "zelle"
  | "bank-ach"
  | "bank-sepa"
  | "bank-swift"
  | "revolut"
  | "paypal"
  | "applepay"
  | "btc"
  | "usdt";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  /** Manual methods require the buyer to upload proof of payment. */
  manual: boolean;
}

const M: Record<PaymentMethodId, PaymentMethod> = {
  zelle: { id: "zelle", label: "Zelle", manual: true },
  "bank-ach": { id: "bank-ach", label: "Bank Transfer (ACH / Wire)", manual: true },
  "bank-sepa": { id: "bank-sepa", label: "Bank Transfer (SEPA)", manual: true },
  "bank-swift": { id: "bank-swift", label: "Bank Transfer (SWIFT)", manual: true },
  revolut: { id: "revolut", label: "Revolut", manual: true },
  paypal: { id: "paypal", label: "PayPal", manual: false },
  applepay: { id: "applepay", label: "Apple Pay", manual: false },
  btc: { id: "btc", label: "Bitcoin (BTC)", manual: true },
  usdt: { id: "usdt", label: "Tether (USDT)", manual: true },
};

export const METHODS_BY_REGION: Record<Region, PaymentMethod[]> = {
  us: [M.zelle, M["bank-ach"], M.paypal, M.applepay, M.btc, M.usdt],
  eu: [M["bank-sepa"], M.revolut, M.paypal, M.btc, M.usdt],
  other: [M["bank-swift"], M.paypal, M.btc, M.usdt],
};

// --- Placeholder recipient details (replace before launch) ---
export const PAY_INFO = {
  zelle: { recipient: "RareDexCards LLC", email: "payments@raredexcards.com" },
  bankAch: {
    bankName: "Example National Bank",
    accountName: "RareDexCards LLC",
    accountNumber: "0000 0000 0000",
    routingNumber: "000000000",
  },
  bankSepa: {
    bankName: "Example Bank Europe",
    accountName: "RareDexCards LLC",
    iban: "DE00 0000 0000 0000 0000 00",
    bic: "EXAMPLDEXXX",
  },
  bankSwift: {
    bankName: "Example International Bank",
    accountName: "RareDexCards LLC",
    accountNumber: "0000 0000 0000",
    swift: "EXAMPLXXXXX",
  },
  revolut: { revtag: "@raredexpay" },
  paypal: { email: "billing@raredexcards.com" },
  btc: { address: "bc1qexampleplaceholderwalletaddress0000" },
  usdt: {
    networks: {
      ERC20: "0xExamplePlaceholderERC20WalletAddress0000",
      TRC20: "TExamplePlaceholderTRC20WalletAddress000",
      BEP20: "0xExamplePlaceholderBEP20WalletAddress0000",
    } as Record<string, string>,
  },
};

export function regionForCountry(country: string): Region {
  if (country === "United States") return "us";
  return EU_COUNTRIES.has(country) ? "eu" : "other";
}

export const EU_COUNTRIES = new Set([
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden",
]);

export const COUNTRIES = [
  "United States",
  ...Array.from(EU_COUNTRIES),
  "United Kingdom", "Switzerland", "Norway", "Canada", "Mexico",
  "Australia", "New Zealand", "Japan", "Singapore", "United Arab Emirates",
  "Saudi Arabia", "Brazil", "South Africa", "Other",
].sort();

export interface ShippingOption {
  id: string;
  label: string;
  eta: string;
  cost: number; // -1 means quoted separately
  freeOverThreshold?: boolean;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "standard", label: "Standard Tracked", eta: "5–10 business days", cost: 39, freeOverThreshold: true },
  { id: "express", label: "Express Courier", eta: "2–4 business days", cost: 89 },
  { id: "freight", label: "Pallet / Freight", eta: "Quoted per destination", cost: -1 },
];
