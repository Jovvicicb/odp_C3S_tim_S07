type Props = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export function PostTagFilterButton({ label, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all hover:-translate-y-0.5 ${
        active
          ? "border-sky-300/25 bg-sky-400/10 text-sky-100 shadow-lg shadow-sky-500/10"
          : "border-white/10 bg-white/4 text-white/45 hover:border-white/20 hover:bg-white/6 hover:text-white/70"
      }`}
    >
      {label}
    </button>
  );
}
