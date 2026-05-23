import type { CommunityDiscoverType } from "../../../types/communities/CommunityDiscoverType";
import { SectionLabel } from "../../ui/SectionLabel";

type Props = {
  search: string;
  type: CommunityDiscoverType;
  total: number;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: CommunityDiscoverType) => void;
};

type FilterItem = {
  value: CommunityDiscoverType;
  label: string;
  description: string;
};

const filters: FilterItem[] = [
  {
    value: "all",
    label: "All",
    description: "Every visible community",
  },
  {
    value: "public",
    label: "Public",
    description: "Open communities",
  },
  {
    value: "private",
    label: "Private",
    description: "Request-based access",
  },
];

export function DiscoverCommunitiesToolbar({
  search,
  type,
  total,
  onSearchChange,
  onTypeChange,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <SectionLabel label="Discovery" tone="sky" />

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
              Find communities
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
              Search communities by name and filter them by access type.
              <span className="ml-2 font-semibold text-sky-100/60">
                {total} {total === 1 ? "community" : "communities"} found.
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-5 p-6">
        <div>
          <label htmlFor="community-search" className="block">
            <SectionLabel label="Search communities" tone="muted" />
          </label>

          <input
            id="community-search"
            name="community-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by community name..."
            className="w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20 hover:border-sky-300/20 focus:border-sky-300/40 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        <div className="h-px bg-white/8" />

        <div>
          <div className="mb-3 flex items-start justify-between gap-3">
            <SectionLabel label="Filter by type" tone="muted" />

            <button
              type="button"
              onClick={() => onTypeChange("all")}
              disabled={type === "all"}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/45 transition-all hover:bg-white/8 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {filters.map((filter) => (
              <DiscoverFilterButton
                key={filter.value}
                filter={filter}
                active={type === filter.value}
                onClick={() => onTypeChange(filter.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DiscoverFilterButton({
  filter,
  active,
  onClick,
}: {
  filter: FilterItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all hover:-translate-y-0.5 ${
        active
          ? "border-sky-300/20 bg-sky-400/10 shadow-lg shadow-sky-500/10"
          : "border-white/8 bg-white/3 hover:border-white/14 hover:bg-white/5"
      }`}
    >
      <div
        className={`absolute -right-10 -top-10 h-24 w-24 rounded-full blur-3xl transition-all ${
          active ? "bg-sky-400/15" : "bg-white/0 group-hover:bg-sky-400/5"
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-sm font-bold ${
              active
                ? "text-sky-100"
                : "text-white/55 group-hover:text-white/80"
            }`}
          >
            {filter.label}
          </span>

          <span
            className={`h-2 w-2 rounded-full transition-all ${
              active ? "bg-sky-300 shadow-lg shadow-sky-400/40" : "bg-white/15"
            }`}
          />
        </div>

        <p
          className={`mt-1 text-xs leading-5 ${
            active
              ? "text-sky-100/45"
              : "text-white/25 group-hover:text-white/35"
          }`}
        >
          {filter.description}
        </p>
      </div>
    </button>
  );
}
