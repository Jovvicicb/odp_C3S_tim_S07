type Props = {
  title: string;
  description: string;
};

export function SectionEmptyState({ title, description }: Props) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 px-5 py-6">
      <p className="text-sm font-semibold text-white/55">{title}</p>

      <p className="mt-1 text-sm leading-6 text-white/30">{description}</p>
    </div>
  );
}
