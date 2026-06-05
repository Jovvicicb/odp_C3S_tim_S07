type Props = {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, total, pageSize, onChange }: Props) {
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
