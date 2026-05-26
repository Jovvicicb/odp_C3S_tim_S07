import type { CommunityMemberRole } from "../../../types/communities/members/CommunityMemberRole";
import { Button } from "../../ui/button/Button";

type Props = {
  userId: number;
  communityRole: CommunityMemberRole;
  loading?: boolean;
  onCommunityRoleChange?: (userId: number, role: CommunityMemberRole) => void;
  onRemoveCommunityMember?: (userId: number) => void;
};

export function UserCommunityMemberActions({
  userId,
  communityRole,
  loading = false,
  onCommunityRoleChange,
  onRemoveCommunityMember,
}: Props) {
  const nextCommunityRole: CommunityMemberRole =
    communityRole === "moderator" ? "member" : "moderator";

  const roleButtonLabel = communityRole === "moderator" ? "Demote" : "Promote";

  return (
    <>
      <Button
        label={roleButtonLabel}
        loadingLabel="Saving..."
        loading={loading}
        variant={communityRole === "moderator" ? "warning" : "primary"}
        size="sm"
        onClick={() => onCommunityRoleChange?.(userId, nextCommunityRole)}
      />

      <Button
        label="Remove"
        loadingLabel="Removing..."
        loading={loading}
        variant="danger"
        size="sm"
        onClick={() => onRemoveCommunityMember?.(userId)}
      />
    </>
  );
}
