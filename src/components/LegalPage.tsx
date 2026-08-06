import { PageHero } from "./PageHero";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero title={title} eyebrow="Legal" />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs text-faint">Last updated: {updated}</p>
        <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted [&_a]:text-royal [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
          {children}
        </div>
      </article>
    </>
  );
}
