type Props = {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
};

export function StatCard({ label, value, sub, color }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-5 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl" />

      <div className="relative z-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-200/40">
          {label}
        </p>

        <p
          className={`mt-3 text-3xl font-semibold tracking-tight ${
            color ?? "text-emerald-300"
          }`}
        >
          {value}
        </p>

        {sub && <p className="mt-2 text-sm text-white/30">{sub}</p>}
      </div>
    </div>
  );
}
