const ITEMS = [
  {
    title: "Authenticity Guaranteed",
    desc: "Every card verified before it ships.",
    icon: (
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Zm-1 11 5-5-1.4-1.4L11 11.2 9.4 9.6 8 11l3 3Z" />
    ),
  },
  {
    title: "Secure Packaging",
    desc: "Sleeved, toploaded & double-boxed.",
    icon: <path d="M3 7l9-4 9 4-9 4-9-4Zm0 2.5 9 4 9-4V17l-9 4-9-4V9.5Z" />,
  },
  {
    title: "Fast Tracked Shipping",
    desc: "Same/next business-day dispatch.",
    icon: (
      <path d="M3 6h11v9H3V6Zm11 3h4l3 3v3h-7V9ZM7 18a2 2 0 100 0Zm10 0a2 2 0 100 0Z" />
    ),
  },
  {
    title: "Trusted by Collectors",
    desc: "Thousands of orders shipped.",
    icon: (
      <path d="M12 2l2.9 6.3L22 9.2l-5 4.6L18.2 21 12 17.3 5.8 21 7 13.8l-5-4.6 7.1-.9L12 2Z" />
    ),
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-gray-100 bg-royal-tint/40">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-royal text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {item.icon}
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold text-charcoal">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
