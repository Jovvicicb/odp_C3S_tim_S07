import { useNavigate } from "react-router-dom";

import type { AdminStatisticsDto } from "../../../models/statistics/AdminStatisticsDto";

import { StatCard } from "../../ui/card/StatCard";
import { SectionCard } from "../../ui/card/SectionCard";
import { Spinner } from "../../ui/spinner/Spinner";

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
    <div className="space-y-6">
      <SectionCard
        label="Platform management"
        title="Content and user administration"
        description="Open the main administrative sections for managing users, communities, posts and global tags."
      >
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
              label="Communities"
              value={String(statistics?.communitiesCount ?? 0)}
              sub="Review platform communities"
              color="text-sky-300"
            />
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/posts")}
            className="text-left"
          >
            <StatCard
              label="Posts"
              value={String(statistics?.postsCount ?? 0)}
              sub="Review and moderate posts"
              color="text-violet-300"
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
        </div>
      </SectionCard>

      <SectionCard
        label="Operations"
        title="Monitoring and audit activity"
        description="Open operational tools for checking system health, database failover status and recorded audit activity."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/admin/health")}
            className="text-left"
          >
            <StatCard
              label="System health"
              value="Monitor"
              sub="Check server and database nodes"
              color="text-emerald-300"
            />
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/audits")}
            className="text-left"
          >
            <StatCard
              label="Audit logs"
              value="Logs"
              sub="Review user and system activity"
              color="text-red-300"
            />
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
