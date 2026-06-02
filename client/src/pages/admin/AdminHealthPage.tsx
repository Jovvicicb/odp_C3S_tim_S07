import { ErrorBox, PageHeader } from "../../components/ui/UI";
import { IntroPanel } from "../../components/ui/IntroPanel";

import { AdminHealthSummary } from "../../components/admin/health/AdminHealthSummary";
import { DbHealthSection } from "../../components/admin/health/DbHealthSection";
import { ServerHealthPanel } from "../../components/admin/health/ServerHealthPanel";

import { useDbHealth } from "../../hooks/health/useDbHealth";
import { useHealthFailover } from "../../hooks/health/useHealthFailover";
import { useServerHealth } from "../../hooks/health/useServerHealth";

export default function AdminHealthPage() {
  const {
    serverHealth,
    loading: serverHealthLoading,
    error: serverHealthError,
    testConnection,
  } = useServerHealth();

  const { nodes, loading, error, reload } = useDbHealth();

  const { triggerFailover, loadingFailover, failoverError } = useHealthFailover(
    {
      reloadHealth: reload,
    },
  );

  const pageError = serverHealthError || error || failoverError;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin panel" title="System health" />

      <IntroPanel
        label="Health monitoring"
        title="Server and database health"
        description="Monitor API availability, current database node roles, separated read/write operations and failover behavior across the distributed system."
        highlight="Use the health checks to verify server and database availability."
      />

      {pageError && <ErrorBox message={pageError} />}

      <AdminHealthSummary nodes={nodes} loading={loading} />

      <ServerHealthPanel
        serverHealth={serverHealth}
        loading={serverHealthLoading}
        onTestConnection={() => void testConnection()}
      />

      <DbHealthSection
        nodes={nodes}
        loading={loading}
        loadingFailover={loadingFailover}
        onReload={() => void reload()}
        onTriggerFailover={() => void triggerFailover()}
      />
    </div>
  );
}
