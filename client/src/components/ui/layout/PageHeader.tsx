import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, action }: Props) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f17]/80 px-6 py-5 shadow-2xl shadow-sky-950/10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between gap-6">
        <div className="shrink-0">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-sky-300/15 bg-sky-400/10 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-sky-300" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-100/60">
              {eyebrow}
            </p>
          </div>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {title}
          </h1>
        </div>

        <div className="flex min-w-30 justify-end">{action}</div>
      </div>
    </div>
  );
}
