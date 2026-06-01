import { useNavigate } from "react-router-dom";

import type { CommunityDto } from "../../../../models/communities/CommunityDto";
import type { CommunityViewerPermissionsDto } from "../../../../models/communities/CommunityViewerPermissionsDto";

import { Button } from "../../../ui/button/Button";
import { CommunityMembershipButton } from "../../shared/CommunityMembershipButton";

type Props = {
  community: CommunityDto;
  permissions: CommunityViewerPermissionsDto;
  isAuthenticated: boolean;
  membershipLoading?: boolean;
  deleteLoading?: boolean;
  onJoin: (communityId: number) => void;
  onLeave: (communityId: number) => void;
  onDelete: (communityId: number) => void;
};

export function CommunityHeroActions({
  community,
  permissions,
  isAuthenticated,
  membershipLoading = false,
  deleteLoading = false,
  onJoin,
  onLeave,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  const showMembershipAction = isAuthenticated && !permissions.isOwner;
  const showEditAction = isAuthenticated && permissions.canUpdateCommunity;
  const showDeleteAction = isAuthenticated && permissions.canDeleteCommunity;

  if (!showMembershipAction && !showEditAction && !showDeleteAction) {
    return null;
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-3">
      {showMembershipAction && (
        <CommunityMembershipButton
          community={community}
          loading={membershipLoading}
          onJoin={onJoin}
          onLeave={onLeave}
        />
      )}

      {showEditAction && (
        <Button
          label="Edit community"
          variant="warning"
          onClick={() => navigate(`/communities/${community.id}/edit`)}
        />
      )}

      {showDeleteAction && (
        <Button
          label="Delete community"
          loadingLabel="Deleting..."
          loading={deleteLoading}
          variant="danger"
          onClick={() => onDelete(community.id)}
        />
      )}
    </div>
  );
}
