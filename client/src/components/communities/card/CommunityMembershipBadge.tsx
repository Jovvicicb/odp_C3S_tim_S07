import type { CommunityDto } from "../../../models/communities/CommunityDto";
import { Badge } from "../../ui/badge/Badge";
import { getCommunityMembershipLabel } from "./CommunityMembershipHelper";

type Props = {
  status: CommunityDto["membershipStatus"];
  isOwner?: boolean;
};

export function CommunityMembershipBadge({ status, isOwner = false }: Props) {
  const label = getCommunityMembershipLabel(status, isOwner);

  const tone =
    isOwner || status === "active"
      ? "sky"
      : status === "pending"
        ? "amber"
        : "muted";

  return (
    <Badge tone={tone} className="rounded-2xl px-3 py-1.5">
      {label}
    </Badge>
  );
}
