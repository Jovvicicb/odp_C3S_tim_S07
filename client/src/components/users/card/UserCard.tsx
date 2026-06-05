import { useNavigate } from "react-router-dom";

import type { UserDto } from "../../../models/users/UserDto";

import type { UserRole } from "../../../types/users/UserRole";
import type { UserFollowStatus } from "../../../types/users/UserFollowStatus";
import type { CommunityMemberRole } from "../../../types/communities/members/CommunityMemberRole";

import { RoleBadge } from "../../ui/badge/RoleBadge";

import { UserAvatar } from "../shared/UserAvatar";
import { UserCommunityMetaBadges } from "../shared/UserCommunityMetaBadges";
import { UserFollowButton } from "../shared/UserFollowButton";
import { UserRoleSelect } from "../shared/UserRoleSelect";
import { UserCommunityMemberActions } from "../shared/UserCommunityMemberActions";

type Props = {
  user: UserDto;

  showRoleControl?: boolean;
  roleLoading?: boolean;
  onRoleChange?: (userId: number, role: UserRole) => void;

  showFollowAction?: boolean;
  followLoading?: boolean;
  onFollow?: (userId: number) => void;
  onUnfollow?: (userId: number) => void;

  showRemoveFollowerAction?: boolean;
  removeFollowerLoading?: boolean;
  onRemoveFollower?: (userId: number) => void;

  showCommunityMeta?: boolean;
  communityRole?: CommunityMemberRole;
  isCommunityOwner?: boolean;
  isCurrentUser?: boolean;

  showCommunityMemberActions?: boolean;
  communityActionLoading?: boolean;
  onCommunityRoleChange?: (userId: number, role: CommunityMemberRole) => void;
  onRemoveCommunityMember?: (userId: number) => void;
};

export function UserCard({
  user,

  showRoleControl = false,
  roleLoading = false,
  onRoleChange,

  showFollowAction = false,
  followLoading = false,
  onFollow,
  onUnfollow,

  showRemoveFollowerAction = false,
  removeFollowerLoading = false,
  onRemoveFollower,

  showCommunityMeta = false,
  communityRole,
  isCommunityOwner = false,
  isCurrentUser = false,

  showCommunityMemberActions = false,
  communityActionLoading = false,
  onCommunityRoleChange,
  onRemoveCommunityMember,
}: Props) {
  const navigate = useNavigate();

  const followStatus = user.followStatus as UserFollowStatus | null;

  const hasActions =
    showRoleControl ||
    (showFollowAction && followStatus !== "self") ||
    showRemoveFollowerAction ||
    (showCommunityMemberActions && communityRole);

  return (
    <article
      onClick={() => navigate(`/users/${user.id}`)}
      className="group h-full cursor-pointer rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-5 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-[#0e1520]/90"
    >
      <div className="flex items-start gap-4">
        <UserAvatar username={user.username} image={user.image} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-semibold text-white">
                  {user.username}
                </h2>

                {!showCommunityMeta && <RoleBadge role={user.role} />}

                {showCommunityMeta && (
                  <UserCommunityMetaBadges
                    communityRole={communityRole}
                    isCommunityOwner={isCommunityOwner}
                    isCurrentUser={isCurrentUser}
                  />
                )}
              </div>

              <p className="mt-1 truncate text-sm text-white/40">
                {user.email}
              </p>

              {user.fullname && (
                <p className="mt-1 truncate text-xs text-white/30">
                  {user.fullname}
                </p>
              )}
            </div>

            <span className="shrink-0 text-white/25 transition-colors group-hover:text-sky-200">
              →
            </span>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4"
          >
            {showRoleControl && (
              <UserRoleSelect
                userId={user.id}
                role={user.role}
                loading={roleLoading}
                onRoleChange={onRoleChange}
              />
            )}

            {showFollowAction && (
              <UserFollowButton
                userId={user.id}
                followStatus={followStatus}
                loading={followLoading}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
              />
            )}

            {showRemoveFollowerAction && (
              <button
                type="button"
                disabled={removeFollowerLoading}
                onClick={() => onRemoveFollower?.(user.id)}
                className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-200 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removeFollowerLoading ? "Removing..." : "Remove"}
              </button>
            )}

            {showCommunityMemberActions && communityRole && (
              <UserCommunityMemberActions
                userId={user.id}
                communityRole={communityRole}
                loading={communityActionLoading}
                onCommunityRoleChange={onCommunityRoleChange}
                onRemoveCommunityMember={onRemoveCommunityMember}
              />
            )}

            {!hasActions && (
              <span className="text-xs text-white/25">View profile</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
