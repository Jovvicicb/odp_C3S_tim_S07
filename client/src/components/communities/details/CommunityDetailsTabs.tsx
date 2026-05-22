import type { CommunityDetailsTab } from "../../../types/communities/CommunityDetailsTab";

type Props = {
  activeTab: CommunityDetailsTab;
  onChange: (tab: CommunityDetailsTab) => void;
  showRequestsTab?: boolean;
};

export function CommunityDetailsTabs({
  activeTab,
  onChange,
  showRequestsTab = false,
}: Props) {
  const tabs: CommunityDetailsTab[] = showRequestsTab
    ? ["posts", "members", "requests"]
    : ["posts", "members"];

  return (
    <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-2 shadow-xl shadow-sky-950/10">
      <div
        className={`grid gap-2 ${
          showRequestsTab ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "border-sky-300/20 bg-sky-400/10 text-sky-100 shadow-lg shadow-sky-500/10"
                : "border-transparent text-white/40 hover:bg-white/4 hover:text-white/70"
            }`}
          >
            {tab === "requests" ? "Requests" : tab}
          </button>
        ))}
      </div>
    </div>
  );
}
