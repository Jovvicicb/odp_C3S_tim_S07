import { SectionLabel } from "./SectionLabel";

type Props = {
  label: string;
  title: string;
  description: string;
  highlight?: string;
  tone?: "sky" | "amber" | "muted";
};

export function IntroPanel({
  label,
  title,
  description,
  highlight,
  tone = "sky",
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 p-6">
        <SectionLabel label={label} tone={tone} />

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          {description}

          {highlight && (
            <span className="ml-2 font-semibold text-sky-100/60">
              {highlight}
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
