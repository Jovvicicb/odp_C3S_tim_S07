import type { DbNodeHealthDto } from "../../../models/health/DbNodeHealthDto";

import { Button } from "../../ui/button/Button";
import { CountBadge } from "../../ui/CountBadge";
import { SectionCard } from "../../ui/SectionCard";
import { SectionEmptyState } from "../../ui/SectionEmptyState";
import { Spinner } from "../../ui/UI";
import { DbHealthNodeCard } from "./DbHealthNodeCard";

type Props = {
  nodes: DbNodeHealthDto[];
  loading: boolean;
  loadingFailover: boolean;
  onReload: () => void;
  onTriggerFailover: () => void;
};

export function DbHealthSection({
  nodes,
  loading,
  loadingFailover,
  onReload,
  onTriggerFailover,
}: Props) {
  return (
    <SectionCard
      label="Database nodes"
      title="Replication health"
      description="Review current master and slave roles, read availability, database node status and separated read/write operation counters."
      action={
        <CountBadge count={nodes.length} singular="node" plural="nodes" />
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Button
          label="Refresh"
          variant="secondary"
          size="sm"
          onClick={onReload}
        />

        <Button
          label="Trigger failover"
          loadingLabel="Triggering..."
          loading={loadingFailover}
          variant="warning"
          size="sm"
          onClick={onTriggerFailover}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : nodes.length === 0 ? (
        <SectionEmptyState
          title="No database nodes found."
          description="Database node health information is not currently available."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {nodes.map((node) => (
            <DbHealthNodeCard key={`${node.name}-${node.port}`} node={node} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
