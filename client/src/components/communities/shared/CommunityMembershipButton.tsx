import type { CommunityDto } from "../../../models/communities/CommunityDto";
import { Button } from "../../ui/button/Button";

type Props = {
  community: CommunityDto;
  loading?: boolean;
  onJoin?: (communityId: number) => void;
  onLeave?: (communityId: number) => void;
};

export function CommunityMembershipButton({
  community,
  loading = false,
  onJoin,
  onLeave,
}: Props) {
  const isActiveMember = community.membershipStatus === "active";
  const isPending = community.membershipStatus === "pending";
  const isBanned = community.membershipStatus === "banned";
  const canJoin = community.membershipStatus === null;

  if (!canJoin && !isActiveMember && !isPending && !isBanned) {
    return null;
  }

  const handleClick = () => {
    if (canJoin) {
      onJoin?.(community.id);
      return;
    }

    if (isActiveMember) {
      onLeave?.(community.id);
    }
  };

  if (isPending) {
    return <Button label="Pending" variant="warning" size="sm" disabled />;
  }

  if (isBanned) {
    return <Button label="Banned" variant="secondary" size="sm" disabled />;
  }

  return (
    <Button
      label={isActiveMember ? "Leave" : "Join"}
      loadingLabel={isActiveMember ? "Leaving..." : "Joining..."}
      loading={loading}
      variant={isActiveMember ? "danger" : "success"}
      size="sm"
      onClick={handleClick}
    />
  );
}
