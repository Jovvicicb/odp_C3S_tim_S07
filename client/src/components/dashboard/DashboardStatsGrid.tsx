import { useNavigate } from "react-router-dom";

import { Spinner } from "../ui/UI";
import { StatCard } from "../ui/StatCard";

import { useAuth } from "../../hooks/auth/useAuthHook";

import type { StatisticsDto } from "../../models/statistics/StatisticsDto";

type Props = {
  statistics: StatisticsDto | null;
  loading: boolean;
};

export function DashboardStatsGrid({ statistics, loading }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <div className="flex justify-center py-8">
          <Spinner size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Communities"
        value={String(statistics?.joinedCommunitiesCount ?? 0)}
        sub="Joined communities"
      />

      <StatCard
        label="Posts"
        value={String(statistics?.postsCount ?? 0)}
        sub="Published posts"
      />

      <button
        type="button"
        disabled={!user?.id}
        onClick={() => user?.id && navigate(`/users/${user.id}/followers`)}
        className="text-left disabled:cursor-not-allowed disabled:opacity-70"
      >
        <StatCard
          label="Followers"
          value={String(statistics?.followersCount ?? 0)}
          sub="People following you"
          color="text-emerald-300"
        />
      </button>

      <button
        type="button"
        disabled={!user?.id}
        onClick={() => user?.id && navigate(`/users/${user.id}/following`)}
        className="text-left disabled:cursor-not-allowed disabled:opacity-70"
      >
        <StatCard
          label="Following"
          value={String(statistics?.followingCount ?? 0)}
          sub="People you follow"
          color="text-emerald-300"
        />
      </button>
    </div>
  );
}
