import type { CommunityDiscoverType } from "../../../types/communities/CommunityDiscoverType";

type Props = {
  search: string;
  type: CommunityDiscoverType;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: CommunityDiscoverType) => void;
};

export function DiscoverCommunitiesToolbar({
  search,
  type,
  onSearchChange,
  onTypeChange,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-4 shadow-xl shadow-sky-950/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          id="community-search"
          name="community-search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search communities..."
          className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 md:max-w-md"
        />

        <div className="flex flex-wrap gap-2">
          {(["all", "public", "private"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onTypeChange(value)}
              className={`rounded-2xl border px-4 py-2 text-xs font-semibold capitalize transition-all ${
                type === value
                  ? "border-sky-300/30 bg-sky-400/10 text-sky-100 shadow-lg shadow-sky-500/10"
                  : "border-white/10 bg-white/4 text-white/45 hover:border-white/20 hover:bg-white/6 hover:text-white/70"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
