type Props = {
  count: number;
  singular: string;
  plural: string;
};

export function CountBadge({ count, singular, plural }: Props) {
  const label = count === 1 ? singular : plural;

  return (
    <span className="rounded-2xl border border-sky-300/15 bg-sky-400/10 px-3 py-1.5 text-xs font-bold text-sky-100/70 shadow-lg shadow-sky-500/5">
      {count} {label}
    </span>
  );
}
