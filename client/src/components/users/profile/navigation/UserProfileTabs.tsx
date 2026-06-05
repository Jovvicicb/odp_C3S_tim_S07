import type { UserProfileTab } from "../../../../types/users/profile/UserProfileTab";

import { SectionLabel } from "../../../ui/label/SectionLabel";

type Props = {
  activeTab: UserProfileTab;
  onChange: (tab: UserProfileTab) => void;
};

type TabItem = {
  value: UserProfileTab;
  label: string;
  description: string;
};

export function UserProfileTabs({ activeTab, onChange }: Props) {
  const tabs: TabItem[] = [
    {
      value: "posts",
      label: "Posts",
      description: "Shared content",
    },
    {
      value: "comments",
      label: "Comments",
      description: "Discussion activity",
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 px-5 py-4">
        <SectionLabel label="Profile navigation" tone="sky" />

        <h2 className="mt-2 text-lg font-bold tracking-tight text-white">
          Explore profile activity
        </h2>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onChange(tab.value)}
                className={`group relative overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all hover:-translate-y-0.5 ${
                  isActive
                    ? "border-sky-300/20 bg-sky-400/10 shadow-lg shadow-sky-500/10"
                    : "border-transparent bg-white/2 hover:border-white/10 hover:bg-white/4"
                }`}
              >
                <div
                  className={`absolute -right-10 -top-10 h-24 w-24 rounded-full blur-3xl transition-all ${
                    isActive
                      ? "bg-sky-400/15"
                      : "bg-white/0 group-hover:bg-sky-400/5"
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-sm font-bold tracking-tight ${
                        isActive
                          ? "text-sky-100"
                          : "text-white/55 group-hover:text-white/80"
                      }`}
                    >
                      {tab.label}
                    </span>

                    <span
                      className={`h-2 w-2 rounded-full transition-all ${
                        isActive
                          ? "bg-sky-300 shadow-lg shadow-sky-400/40"
                          : "bg-white/15"
                      }`}
                    />
                  </div>

                  <p
                    className={`mt-1 text-xs leading-5 ${
                      isActive
                        ? "text-sky-100/45"
                        : "text-white/25 group-hover:text-white/35"
                    }`}
                  >
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
