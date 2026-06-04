import { useMemo } from "react";

import type { DbNodeHealthDto } from "../../../models/health/DbNodeHealthDto";

import { HealthStatusHelper } from "../../../helpers/health/HealthStatusHelper";
import { Spinner } from "../../ui/UI";
import { StatCard } from "../../ui/StatCard";

type Props = {
  nodes: DbNodeHealthDto[];
  loading: boolean;
};

export function AdminHealthSummary({ nodes, loading }: Props) {
  const summary = useMemo(() => {
    const totalNodes = nodes.length;
    const readableNodes = nodes.filter((node) => node.canServeReads).length;

    const healthyNodes = nodes.filter((node) =>
      HealthStatusHelper.isHealthy(node.status),
    ).length;

    const masterNode = nodes.find((node) => node.role === "master");

    const overallStatus = HealthStatusHelper.overallStatus(
      nodes.map((node) => node.status),
    );

    const totalReads = nodes.reduce(
      (sum, node) => sum + Number(node.successfulReads ?? 0),
      0,
    );

    const totalWrites = nodes.reduce(
      (sum, node) => sum + Number(node.successfulWrites ?? 0),
      0,
    );

    const totalFailures = nodes.reduce(
      (sum, node) =>
        sum + Number(node.failedReads ?? 0) + Number(node.failedWrites ?? 0),
      0,
    );

    return {
      totalNodes,
      healthyNodes,
      readableNodes,
      masterNode,
      overallStatus,
      totalReads,
      totalWrites,
      totalFailures,
    };
  }, [nodes]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <div className="flex justify-center py-8">
          <Spinner size={24} />
        </div>
      </div>
    );
  }

  const overallColor =
    summary.overallStatus === "healthy"
      ? "text-emerald-300"
      : summary.overallStatus === "warning"
        ? "text-amber-300"
        : "text-red-300";

  const overallLabel =
    summary.overallStatus === "healthy"
      ? "Healthy"
      : summary.overallStatus === "warning"
        ? "Warning"
        : "Offline";

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Overall status"
        value={overallLabel}
        sub={`${summary.healthyNodes}/${summary.totalNodes} healthy nodes`}
        color={overallColor}
      />

      <StatCard
        label="Current master"
        value={summary.masterNode?.name ?? "Unknown"}
        sub={
          summary.masterNode
            ? `${summary.masterNode.host}:${summary.masterNode.port}`
            : "No active master"
        }
        color="text-amber-300"
      />

      <StatCard
        label="Read ops"
        value={summary.totalReads}
        sub={`${summary.readableNodes} nodes available for reads`}
        color="text-sky-300"
      />

      <StatCard
        label="Write ops"
        value={summary.totalWrites}
        sub={
          summary.totalFailures > 0
            ? `${summary.totalFailures} failed operations`
            : "No failed operations"
        }
        color={summary.totalFailures > 0 ? "text-red-300" : "text-emerald-300"}
      />
    </div>
  );
}
