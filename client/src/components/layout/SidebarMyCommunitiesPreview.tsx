import { useNavigate } from "react-router-dom";

import { useMyCommunities } from "../../hooks/communities/my/useMyCommunities";
import { SidebarEvents } from "../../helpers/events/SidebarEvents";
import { useEffect } from "react";

type Props = {
  visible: boolean;
  onNavigate?: () => void;
};

export function SidebarMyCommunitiesPreview({ visible, onNavigate }: Props) {
  const navigate = useNavigate();

  const { communities, loading, error, total, reload } = useMyCommunities(1, 5);

  useEffect(() => {
    const handleRefresh = () => {
      void reload();
    };

    window.addEventListener(SidebarEvents.myCommunitiesChanged, handleRefresh);

    return () => {
      window.removeEventListener(
        SidebarEvents.myCommunitiesChanged,
        handleRefresh,
      );
    };
  }, [reload]);

  if (!visible) {
    return null;
  }

  const handleNavigate = (to: string) => {
    onNavigate?.();
    navigate(to);
  };

  return (
    <div className="ml-4 mt-2 overflow-hidden rounded-2xl border border-white/8 bg-white/3">
      <div className="border-b border-white/8 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-200/45">
            My communities
          </p>

          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/35">
            {total}
          </span>
        </div>
      </div>

      <div className="p-2">
        {loading && communities.length === 0 ? (
          <p className="rounded-xl px-3 py-2 text-xs text-white/30">
            Loading communities...
          </p>
        ) : error ? (
          <p className="rounded-xl px-3 py-2 text-xs text-red-300/70">
            Failed to load communities.
          </p>
        ) : communities.length === 0 ? (
          <p className="rounded-xl px-3 py-2 text-xs leading-5 text-white/30">
            You have not joined communities yet.
          </p>
        ) : (
          <div className="space-y-1">
            {communities.map((community) => (
              <button
                key={community.id}
                type="button"
                onClick={() => handleNavigate(`/communities/${community.id}`)}
                className="group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-all hover:bg-sky-400/10"
              >
                <span className="min-w-0 truncate text-xs font-semibold text-white/50 group-hover:text-sky-100">
                  {community.name}
                </span>

                <span className="shrink-0 text-xs text-white/20 group-hover:text-sky-200">
                  →
                </span>
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => handleNavigate("/communities/mine")}
          className="mt-2 flex w-full items-center justify-between rounded-xl border border-sky-300/10 bg-sky-400/8 px-3 py-2 text-left text-xs font-bold text-sky-100/65 transition-all hover:border-sky-300/20 hover:bg-sky-400/12 hover:text-sky-100"
        >
          <span>View all</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
