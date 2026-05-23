import { SectionLabel } from "../../ui/SectionLabel";

export function CommunityFormIntro() {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 p-6">
        <SectionLabel label="Create community" tone="sky" />

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
          Start a new community
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          Create a public or private space, describe its purpose and set clear
          rules so members know what kind of discussions belong there.
        </p>
      </div>
    </section>
  );
}
