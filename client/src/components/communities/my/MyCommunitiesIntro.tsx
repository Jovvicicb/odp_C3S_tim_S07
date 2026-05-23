import { SectionLabel } from "../../ui/SectionLabel";

type Props = {
  total: number;
};

export function MyCommunitiesIntro({ total }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 p-6">
        <SectionLabel label="Your communities" tone="sky" />

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
          Communities you follow
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          Quickly access the communities where you can read posts, join
          discussions and keep up with members.
          <span className="ml-2 font-semibold text-sky-100/60">
            {total} {total === 1 ? "community" : "communities"} in your list.
          </span>
        </p>
      </div>
    </section>
  );
}
