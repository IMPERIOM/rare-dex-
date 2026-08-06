import { cn } from "@/lib/cn";

type Tone =
  | "royal"
  | "gold"
  | "green"
  | "red"
  | "violet"
  | "neutral"
  | "amber";

const tones: Record<Tone, string> = {
  royal: "bg-royal/15 text-royal ring-1 ring-royal/30",
  gold: "bg-gold/15 text-gold ring-1 ring-gold/30",
  green: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  red: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
  violet: "bg-violet/15 text-violet-light ring-1 ring-violet/30",
  amber: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  neutral: "bg-white/[0.06] text-muted ring-1 ring-white/10",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
