import type { ReactNode } from "react";

type BadgeTone = "sky" | "amber" | "emerald" | "red" | "muted" | "white";

type Props = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const toneStyles: Record<BadgeTone, string> = {
  sky: "border-sky-300/15 bg-sky-400/10 text-sky-100/70 shadow-sky-500/5",
  amber:
    "border-amber-400/20 bg-amber-400/10 text-amber-300 shadow-amber-500/5",
  emerald:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-emerald-500/5",
  red: "border-red-400/20 bg-red-500/10 text-red-200 shadow-red-500/5",
  muted: "border-white/10 bg-white/5 text-white/45 shadow-sky-950/5",
  white: "border-white/10 bg-white/8 text-white/65 shadow-sky-950/5",
};

export function Badge({ children, tone = "sky", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-xl border px-2.5 py-1 text-xs font-semibold shadow-lg ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
