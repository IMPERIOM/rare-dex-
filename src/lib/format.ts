export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Company + wholesale program constants. RareDexCards is positioned as a
 * global B2B Pokémon wholesale supplier — no retail pricing is displayed.
 */
export const SITE = {
  name: "RareDexCards",
  domain: "raredexcards.com",
  url: "https://raredexcards.com",
  tagline: "Your Trusted Global Pokémon Wholesale Partner",
  blurb:
    "Supplying authentic Pokémon TCG products in bulk to retailers, distributors, and resellers worldwide.",
  email: "wholesale@raredexcards.com",
  salesEmail: "sales@raredexcards.com",
  whatsapp: "+44 7852 947282",
  whatsappUrl: "https://wa.me/447852947282",
  phone: "+44 7852 947282",
  hours: "Mon–Fri, 9:00–18:00 (EST)",
  warehouse: "Global fulfillment — US, EU & Asia distribution hubs",
  // $500 minimum order value (MOQ). Every completed order ships free.
  minOrder: 500,
  freeShipThreshold: 500,
  social: {
    instagram: "https://instagram.com",
    x: "https://x.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
  disclaimer:
    "RareDexCards is an independent wholesale distributor and is not affiliated with, sponsored by, or endorsed by Nintendo, Game Freak, or The Pokémon Company. Pokémon and all related trademarks are property of their respective owners.",
};
