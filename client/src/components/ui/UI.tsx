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

export function Empty({ message = "No data" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/8 bg-[#0b0f17]/70 py-20 shadow-xl shadow-sky-950/10">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-400/10">
        <span className="text-xl text-sky-200/60">◦</span>
      </div>

      <p className="text-sm font-medium text-white/35">{message}</p>
    </div>
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

// TODO: Add StatusBadge variants for your domain entity statuses
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    active: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const dotStyles: Record<string, string> = {
    pending: "bg-yellow-400",
    active: "bg-sky-400 animate-pulse",
    completed: "bg-emerald-400",
    cancelled: "bg-red-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] ?? "bg-white/5 text-white/40 border-white/10"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] ?? "bg-white/30"}`}
      />
      {status}
    </span>
  );
}

export function NodeBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    healthy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    degraded: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    offline: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] ?? "bg-white/5 text-white/40 border-white/10"}`}
    >
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-xl border px-2.5 py-1 text-xs font-semibold capitalize ${
        role === "admin"
          ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
          : "border-sky-400/15 bg-sky-400/10 text-sky-200/70"
      }`}
    >
      {role}
    </span>
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

export function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-5 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl" />

      <div className="relative z-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-200/40">
          {label}
        </p>

        <p
          className={`mt-3 text-3xl font-semibold tracking-tight ${color ?? "text-white"}`}
        >
          {value}
        </p>

        {sub && <p className="mt-2 text-sm text-white/30">{sub}</p>}
      </div>
    </div>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="border-b border-white/8 bg-white/3">
        {columns.map((c) => (
          <th
            key={c}
            className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-200/35"
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
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
