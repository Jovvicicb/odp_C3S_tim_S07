import { ErrorBox, PageHeader } from "../../components/ui/UI";
import { IntroPanel } from "../../components/ui/IntroPanel";

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
        description="Manage platform users, communities, global tags and operational monitoring from one place."
        highlight="Use the dashboard cards to open each admin section."
      />

      {error && <ErrorBox message={error} />}

      <AdminStatsGrid statistics={statistics} loading={loading} />
    </div>
  );
}
