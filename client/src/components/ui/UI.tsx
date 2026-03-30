import { type ReactNode } from "react";

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin inline-block" style={{ color: "rgba(255,255,255,0.4)" }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 60" />
    </svg>
  );
}

export function Empty({ message = "No data" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-12 h-12 rounded-full bg-white/3 border border-white/6 flex items-center justify-center">
        <span className="text-white/20 text-lg">◦</span>
      </div>
      <p className="text-sm text-white/25">{message}</p>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="border border-red-500/20 bg-red-500/10 text-red-300 text-sm px-4 py-3 rounded-xl">
      {message}
    </div>
  );
}

export function SuccessBox({ message }: { message: string }) {
  return (
    <div className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-sm px-4 py-3 rounded-xl">
      {message}
    </div>
  );
}

// TODO: Add StatusBadge variants for your domain entity statuses
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    active:    "bg-sky-500/10 text-sky-400 border-sky-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const dotStyles: Record<string, string> = {
    pending: "bg-yellow-400", active: "bg-sky-400 animate-pulse", completed: "bg-emerald-400", cancelled: "bg-red-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] ?? "bg-white/5 text-white/40 border-white/10"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] ?? "bg-white/30"}`} />
      {status}
    </span>
  );
}

export function NodeBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    healthy:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    degraded: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    offline:  "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] ?? "bg-white/5 text-white/40 border-white/10"}`}>
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
      role === "admin" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-white/5 text-white/40 border-white/10"
    }`}>{role}</span>
  );
}

export function Pagination({ page, total, pageSize, onChange }: { page: number; total: number; pageSize: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-3 mt-5 text-xs text-white/30">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}
        className="px-3 py-1.5 border border-white/10 rounded-lg hover:border-white/20 disabled:opacity-30 transition-colors">←</button>
      <span className="font-mono">{page} / {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}
        className="px-3 py-1.5 border border-white/10 rounded-lg hover:border-white/20 disabled:opacity-30 transition-colors">→</button>
      <span className="text-white/20">{total} total</span>
    </div>
  );
}

export function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white/3 border border-white/6 rounded-2xl p-5 flex flex-col gap-2 hover:border-white/10 transition-colors">
      <p className="text-xs text-white/30 uppercase tracking-widest font-mono">{label}</p>
      <p className={`text-2xl font-semibold tracking-tight ${color ?? "text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-white/25">{sub}</p>}
    </div>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white/2 border border-white/6 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="border-b border-white/6">
        {columns.map((c) => (
          <th key={c} className="text-left px-5 py-3.5 text-xs text-white/25 font-mono uppercase tracking-wider">{c}</th>
        ))}
      </tr>
    </thead>
  );
}

export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <p className="text-xs text-white/25 font-mono uppercase tracking-widest mb-1">{eyebrow}</p>
        <h1 className="text-xl font-semibold text-white tracking-tight">{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
