import { type ReactNode } from "react";

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin inline-block"
      style={{ color: "rgba(255,255,255,0.4)" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="40 60"
      />
    </svg>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 shadow-lg shadow-red-950/10">
      {message}
    </div>
  );
}

export function SuccessBox({ message }: { message: string }) {
  return (
    <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 shadow-lg shadow-emerald-950/10">
      {message}
    </div>
  );
}

export function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/8 bg-[#0b0f17]/70 px-4 py-3 shadow-xl shadow-sky-950/10">
      <span className="text-xs font-medium text-white/30">
        {total} total items
      </span>

      <div className="flex items-center gap-3">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-white/55 transition-all hover:border-sky-300/20 hover:bg-sky-400/10 hover:text-sky-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ←
        </button>

        <span className="rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-xs font-semibold text-white/55">
          {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-white/55 transition-all hover:border-sky-300/20 hover:bg-sky-400/10 hover:text-sky-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
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
