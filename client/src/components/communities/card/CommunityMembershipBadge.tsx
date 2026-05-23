import type { CommunityDto } from "../../../models/communities/CommunityDto";
import { getCommunityMembershipLabel } from "./CommunityMembershipHelper";

type Props = {
  status: CommunityDto["membershipStatus"];
  isOwner?: boolean;
};

export function CommunityMembershipBadge({ status, isOwner = false }: Props) {
  const label = getCommunityMembershipLabel(status, isOwner);

  return (
    <span className="rounded-xl border border-sky-300/10 bg-sky-400/5 px-3 py-1.5 text-xs font-semibold text-sky-100/55">
      {label}
    </span>
  );
}
