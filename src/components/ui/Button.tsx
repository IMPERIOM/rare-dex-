import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "gold" | "outline" | "glass" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-royal to-violet text-white shadow-[0_10px_30px_-8px_#3b82f688] hover:shadow-[0_14px_40px_-8px_#7c3aedaa] hover:brightness-110",
  gold:
    "bg-gradient-to-br from-gold to-gold-dark text-[#1a1205] shadow-[0_10px_30px_-8px_#fbbf2488] hover:brightness-105",
  outline:
    "border border-line-strong bg-white/[0.03] text-ink hover:bg-white/[0.08] hover:border-white/30",
  glass:
    "glass text-ink hover:bg-white/[0.09]",
  ghost: "text-muted hover:text-ink hover:bg-white/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

/** Class string for a button-styled element (use on <Link> too). */
export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
