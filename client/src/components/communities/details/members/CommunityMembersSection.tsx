import type { PaginatedListDto } from "../../../../models/common/PaginatedListDto";
import type { CommunityMemberDetailsDto } from "../../../../models/communities/CommunityMemberDetailsDto";
import type { CommunityViewerPermissionsDto } from "../../../../models/communities/CommunityViewerPermissionsDto";
import type { CommunityMemberRole } from "../../../../types/communities/CommunityMemberRole";
import { UserCard } from "../../../users/UserCard";

type Props = {
  communityId: number;
  members: PaginatedListDto<CommunityMemberDetailsDto> | null;
  permissions: CommunityViewerPermissionsDto;
  currentUserId?: number;
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
  loadingUserId,
  loadingMemberActionUserId,
  onFollow,
  onUnfollow,
  onCommunityRoleChange,
  onRemoveCommunityMember,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Members
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/35">
            View community members, owners and moderators.
          </p>
        </div>

        {permissions.canManageMembers && (
          <span className="w-fit rounded-2xl border border-sky-300/15 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-100">
            Moderator tools enabled
          </span>
        )}
      </div>

      {!members || members.items.length === 0 ? (
        <p className="mt-5 text-sm text-white/35">No members found.</p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {members.items.map((member) => {
            const user = member.user;
            const isCurrentUser = currentUserId === user.id;

            const canManageThisMember =
              permissions.canManageMembers && !member.isOwner && !isCurrentUser;

            return (
              <UserCard
                key={user.id}
                user={user}
                showCommunityMeta
                communityRole={member.communityRole}
                isCommunityOwner={member.isOwner}
                isCurrentUser={isCurrentUser}
                showFollowAction
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
    </div>
  );
}
