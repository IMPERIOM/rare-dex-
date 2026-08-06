import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  linkHref,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-royal">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
      </div>
      {linkHref && (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink"
        >
          {linkLabel ?? "View all"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
