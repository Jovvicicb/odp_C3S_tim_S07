type Tone = "sky" | "amber" | "muted";

type Props = {
  label: string;
  tone?: Tone;
};

const dotStyles: Record<Tone, string> = {
  sky: "bg-sky-300/70 shadow-[0_0_12px_rgba(125,211,252,0.55)]",
  amber: "bg-amber-300/45",
  muted: "bg-white/25",
};

const textStyles: Record<Tone, string> = {
  sky: "text-sky-200/55",
  amber: "text-amber-200/35",
  muted: "text-white/25",
};

export function SectionLabel({ label, tone = "sky" }: Props) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[tone]}`} />

      <p
        className={`text-[10px] font-bold uppercase tracking-[0.25em] ${textStyles[tone]}`}
      >
        {label}
      </p>
    </div>
  );
}
