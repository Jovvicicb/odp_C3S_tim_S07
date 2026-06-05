import { Badge } from "../../ui/badge/Badge";

import { HealthStatusHelper } from "../../../helpers/health/HealthStatusHelper";

type Props = {
  status: string;
};

export function DbNodeStatusBadge({ status }: Props) {
  return (
    <Badge
      tone={HealthStatusHelper.badgeTone(status)}
      className="rounded-2xl px-3 py-1.5"
    >
      {HealthStatusHelper.label(status)}
    </Badge>
  );
}
