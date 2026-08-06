export function PageHero({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_120%_at_15%_0%,#1e3a8a55_0%,transparent_60%),radial-gradient(50%_100%_at_95%_0%,#7c3aed44_0%,transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-16">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-sm text-muted sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
