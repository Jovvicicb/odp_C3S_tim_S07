import type { CommunityDto } from "../../../../models/communities/CommunityDto";
import type { CommunityViewerPermissionsDto } from "../../../../models/communities/CommunityViewerPermissionsDto";

import { CommunityMembershipButton } from "../../CommunityMembershipButton";

type Props = {
  community: CommunityDto;
  permissions: CommunityViewerPermissionsDto;
  membershipLoading?: boolean;
  deleteLoading?: boolean;
  onJoin: (communityId: number) => void;
  onLeave: (communityId: number) => void;
  onDelete: (communityId: number) => void;
};

export function CommunityHeroActions({
  community,
  permissions,
  membershipLoading = false,
  deleteLoading = false,
  onJoin,
  onLeave,
  onDelete,
}: Props) {
  const showMembershipAction = !permissions.isOwner;
  const showDeleteAction = permissions.canDeleteCommunity;

  if (!showMembershipAction && !showDeleteAction) {
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

      {showDeleteAction && (
        <button
          type="button"
          disabled={deleteLoading}
          onClick={() => onDelete(community.id)}
          className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-200 transition-all hover:-translate-y-0.5 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {deleteLoading ? "Deleting..." : "Delete community"}
        </button>
      )}
    </div>
  );
}
