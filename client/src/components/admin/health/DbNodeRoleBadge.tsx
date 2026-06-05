import type { DbNodeRole } from "../../../models/health/DbNodeHealthDto";

import { Badge } from "../../ui/badge/Badge";

import { DbNodeRoleHelper } from "../../../helpers/health/DbNodeRoleHelper";

type Props = {
  role: DbNodeRole;
};

export function DbNodeRoleBadge({ role }: Props) {
  return (
    <Badge
      tone={DbNodeRoleHelper.tone(role)}
      className="rounded-2xl px-3 py-1.5"
    >
      {DbNodeRoleHelper.label(role)}
    </Badge>
  );
}
