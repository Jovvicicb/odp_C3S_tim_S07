import { useNavigate } from "react-router-dom";

import type { AdminStatisticsDto } from "../../../models/statistics/AdminStatisticsDto";

import { Spinner } from "../../ui/UI";
import { StatCard } from "../../ui/StatCard";

type Props = {
  statistics: AdminStatisticsDto | null;
  loading: boolean;
};

export function AdminStatsGrid({ statistics, loading }: Props) {
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
      <button
        type="button"
        onClick={() => navigate("/admin/users")}
        className="text-left"
      >
        <StatCard
          label="Users"
          value={String(statistics?.usersCount ?? 0)}
          sub="Manage roles and accounts"
          color="text-emerald-300"
        />
      </button>

      <button
        type="button"
        onClick={() => navigate("/admin/communities")}
        className="text-left"
      >
        <StatCard
          label="All communities"
          value={String(statistics?.communitiesCount ?? 0)}
          sub="Review platform communities"
          color="text-sky-300"
        />
      </button>

      <button
        type="button"
        onClick={() => navigate("/admin/tags")}
        className="text-left"
      >
        <StatCard
          label="Global tags"
          value={String(statistics?.tagsCount ?? 0)}
          sub="Manage reusable post tags"
          color="text-amber-300"
        />
      </button>

      <button
        type="button"
        onClick={() => navigate("/admin/health")}
        className="text-left"
      >
        <StatCard
          label="System health"
          value="Monitor"
          sub="Check database nodes"
          color="text-emerald-300"
        />
      </button>
    </div>
  );
}
