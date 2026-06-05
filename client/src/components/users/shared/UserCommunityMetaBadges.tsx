import type { CommunityMemberRole } from "../../../types/communities/members/CommunityMemberRole";
import { Badge } from "../../ui/badge/Badge";

type Props = {
  communityRole?: CommunityMemberRole;
  isCommunityOwner?: boolean;
  isCurrentUser?: boolean;
};

export function UserCommunityMetaBadges({
  communityRole,
  isCommunityOwner = false,
  isCurrentUser = false,
}: Props) {
  const communityRoleLabel =
    communityRole === "moderator" ? "Moderator" : "Member";

  return (
    <>
      {isCommunityOwner && <Badge tone="amber">Owner</Badge>}

      {communityRole && (
        <Badge tone={communityRole === "moderator" ? "sky" : "muted"}>
          {communityRoleLabel}
        </Badge>
      )}

      {isCurrentUser && <Badge tone="emerald">You</Badge>}
    </>
  );
}
