import type { DbNodeHealthDto } from "../../../models/health/DbNodeHealthDto";

import { DbNodeRoleHelper } from "../../../helpers/health/DbNodeRoleHelper";
import { DbReadAvailabilityHelper } from "../../../helpers/health/DbReadAvailabilityHelper";
import { DbNodeRoleBadge } from "./DbNodeRoleBadge";
import { DbNodeStatusBadge } from "./DbNodeStatusBadge";
import { SectionLabel } from "../../ui/SectionLabel";
import { Badge } from "../../ui/Badge";

type Props = {
  node: DbNodeHealthDto;
};

export function DbHealthNodeCard({ node }: Props) {
  const lastCheck = node.lastCheck
    ? new Date(node.lastCheck).toLocaleString()
    : "Not checked yet";

  const readAvailabilityLabel = DbReadAvailabilityHelper.label(node);
  const readAvailabilityDescription =
    DbReadAvailabilityHelper.description(node);
  const readAvailabilityTone = DbReadAvailabilityHelper.tone(node);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-5 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-white/5">
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-sky-400/5 blur-3xl transition-all group-hover:bg-sky-400/10" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <SectionLabel
              label={DbNodeRoleHelper.description(node.role)}
              tone={DbNodeRoleHelper.tone(node.role)}
            />

            <h3 className="text-lg font-bold tracking-tight text-white">
              {node.name}
            </h3>

            <p className="mt-1 text-xs text-white/30">
              {node.host}:{node.port}
            </p>

            <p className="mt-2 text-xs text-white/35">
              {readAvailabilityDescription}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <DbNodeRoleBadge role={node.role} />
            <DbNodeStatusBadge status={node.status} />

            <Badge
              tone={readAvailabilityTone}
              className="rounded-2xl px-3 py-1"
            >
              {readAvailabilityLabel}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-white/8 pt-4 sm:grid-cols-2">
          <MetricBox
            label="Successful reads"
            value={node.successfulReads}
            valueClassName="text-sky-300"
          />

          <MetricBox
            label="Failed reads"
            value={node.failedReads}
            valueClassName={
              node.failedReads > 0 ? "text-red-300" : "text-white/45"
            }
          />

          <MetricBox
            label="Successful writes"
            value={node.successfulWrites}
            valueClassName="text-emerald-300"
          />

          <MetricBox
            label="Failed writes"
            value={node.failedWrites}
            valueClassName={
              node.failedWrites > 0 ? "text-red-300" : "text-white/45"
            }
          />
        </div>

        <p className="mt-4 text-xs text-white/30">
          Last check:{" "}
          <span className="font-semibold text-white/50">{lastCheck}</span>
        </p>
      </div>
    </article>
  );
}

type MetricBoxProps = {
  label: string;
  value: number;
  valueClassName: string;
};

function MetricBox({ label, value, valueClassName }: MetricBoxProps) {
  return (
    <div className="rounded-2xl border border-white/6 bg-black/10 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p className={`mt-2 text-xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}
