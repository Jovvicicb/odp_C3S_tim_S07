import type { ServerHealthDto } from "../../../models/health/ServerHealthDto";

import { ServerHealthHelper } from "../../../helpers/health/ServerHealthHelper";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/button/Button";
import { SectionCard } from "../../ui/SectionCard";
import { Spinner } from "../../ui/UI";

type Props = {
  serverHealth: ServerHealthDto | null;
  loading: boolean;
  onTestConnection: () => void;
};

export function ServerHealthPanel({
  serverHealth,
  loading,
  onTestConnection,
}: Props) {
  const isHealthy = ServerHealthHelper.isHealthy(serverHealth?.status ?? "");

  return (
    <SectionCard
      label="Server connection"
      title="API health check"
      description="Test whether the API server is reachable and responding to health checks."
      action={
        <Button
          label="Test connection"
          loadingLabel="Testing..."
          loading={loading}
          variant="secondary"
          size="sm"
          onClick={onTestConnection}
        />
      }
    >
      {loading && !serverHealth ? (
        <div className="flex justify-center py-10">
          <Spinner size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
              Status
            </p>

            <div className="mt-3">
              <Badge
                tone={isHealthy ? "emerald" : "red"}
                className="rounded-2xl px-3 py-1.5"
              >
                {serverHealth?.status ?? "Unavailable"}
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
              Uptime
            </p>

            <p className="mt-3 text-xl font-bold text-sky-300">
              {serverHealth
                ? ServerHealthHelper.formatUptime(serverHealth.uptime)
                : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
              Last checked
            </p>

            <p className="mt-3 text-sm font-semibold text-white/55">
              {serverHealth
                ? ServerHealthHelper.formatTimestamp(serverHealth.timestamp)
                : "Not checked yet"}
            </p>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
