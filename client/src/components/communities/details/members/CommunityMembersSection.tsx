import type { PaginatedListDto } from "../../../../models/common/PaginatedListDto";
import type { CommunityMemberDetailsDto } from "../../../../models/communities/CommunityMemberDetailsDto";
import type { CommunityViewerPermissionsDto } from "../../../../models/communities/CommunityViewerPermissionsDto";
import type { CommunityMemberRole } from "../../../../types/communities/members/CommunityMemberRole";

import { CountBadge } from "../../../ui/CountBadge";
import { SectionCard } from "../../../ui/SectionCard";
import { SectionEmptyState } from "../../../ui/SectionEmptyState";
import { UserCard } from "../../../users/card/UserCard";

type Props = {
  communityId: number;
  members: PaginatedListDto<CommunityMemberDetailsDto> | null;
  permissions: CommunityViewerPermissionsDto;
  currentUserId?: number;
  isAuthenticated: boolean;
  loadingUserId: number | null;
  loadingMemberActionUserId: number | null;
  onFollow: (userId: number) => void;
  onUnfollow: (userId: number) => void;
  onCommunityRoleChange: (
    communityId: number,
    userId: number,
    role: CommunityMemberRole,
  ) => void;
  onRemoveCommunityMember: (communityId: number, userId: number) => void;
};

export function CommunityMembersSection({
  communityId,
  members,
  permissions,
  currentUserId,
  isAuthenticated,
  loadingUserId,
  loadingMemberActionUserId,
  onFollow,
  onUnfollow,
  onCommunityRoleChange,
  onRemoveCommunityMember,
}: Props) {
  const hasMembers = members !== null && members.items.length > 0;

  return (
    <SectionCard
      label="Members"
      title="Community members"
      description={
        isAuthenticated
          ? "Browse people inside this community, follow members and manage roles when you have permission."
          : "Browse people inside this community and open their public profiles."
      }
      action={
        <CountBadge
          count={members?.total ?? 0}
          singular="member"
          plural="members"
        />
      }
    >
      {!hasMembers ? (
        <SectionEmptyState
          title="No members found."
          description="Members will appear here after they join this community."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {members.items.map((member) => {
            const user = member.user;
            const isCurrentUser = currentUserId === user.id;

            const canManageThisMember =
              isAuthenticated &&
              permissions.canManageMembers &&
              !member.isOwner &&
              !isCurrentUser;

            return (
              <UserCard
                key={user.id}
                user={user}
                showCommunityMeta
                communityRole={member.communityRole}
                isCommunityOwner={member.isOwner}
                isCurrentUser={isCurrentUser}
                showFollowAction={isAuthenticated}
                followLoading={loadingUserId === user.id}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
                showCommunityMemberActions={canManageThisMember}
                communityActionLoading={loadingMemberActionUserId === user.id}
                onCommunityRoleChange={(userId, role) =>
                  onCommunityRoleChange(communityId, userId, role)
                }
                onRemoveCommunityMember={(userId) =>
                  onRemoveCommunityMember(communityId, userId)
                }
              />
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
