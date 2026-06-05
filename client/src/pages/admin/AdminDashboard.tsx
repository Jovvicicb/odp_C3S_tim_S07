import { ErrorBox } from "../../components/ui/feedback/ErrorBox";
import { PageHeader } from "../../components/ui/layout/PageHeader";
import { IntroPanel } from "../../components/ui/panel/IntroPanel";

import { AdminStatsGrid } from "../../components/admin/dashboard/AdminStatsGrid";

import { useAdminDashboardStatistics } from "../../hooks/statistics/useAdminDashboardStatistics";

export default function AdminDashboard() {
  const { statistics, loading, error } = useAdminDashboardStatistics();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin panel" title="Dashboard" />

      <IntroPanel
        label="Administration"
        title="PulseNet administration"
        description="Manage users, communities, posts, global tags, system health and audit activity from one central admin panel."
        highlight="Use the dashboard cards to quickly open each administrative section."
      />

      {error && <ErrorBox message={error} />}

      <AdminStatsGrid statistics={statistics} loading={loading} />
    </div>
  );
}
