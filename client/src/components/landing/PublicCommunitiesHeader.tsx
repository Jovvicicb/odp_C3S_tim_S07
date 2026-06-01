import { Link } from "react-router-dom";

import { CountBadge } from "../ui/CountBadge";
import { SectionLabel } from "../ui/SectionLabel";

type Props = {
  total: number;
};

export function PublicCommunitiesHeader({ total }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <SectionLabel label="Public communities" tone="sky" />

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
              Explore public communities
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
              Browse open communities and read public discussions before
              creating an account.
              <span className="ml-2 font-semibold text-sky-100/60">
                {total} {total === 1 ? "community" : "communities"} available.
              </span>
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <CountBadge
              count={total}
              singular="community"
              plural="communities"
            />

            <Link
              to="/communities"
              className="rounded-2xl border border-sky-300/15 bg-sky-400/8 px-4 py-2 text-xs font-bold text-sky-100/65 transition-all hover:border-sky-300/25 hover:bg-sky-400/12 hover:text-sky-100"
            >
              Discover all →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
