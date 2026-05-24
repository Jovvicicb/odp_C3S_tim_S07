type Props = {
  title: string;
  description: string;
};

export function SectionEmptyState({ title, description }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-300/12 bg-sky-400/4 px-5 py-6 shadow-lg shadow-sky-950/10">
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative z-10">
        <p className="text-sm font-bold text-white/75">{title}</p>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-white/45">
          {description}
        </p>
      </div>
    </div>
  );
}
