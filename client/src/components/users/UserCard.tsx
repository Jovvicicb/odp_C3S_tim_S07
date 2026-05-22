import { useNavigate } from "react-router-dom";
import { ImageHelper } from "../../helpers/images/ImageHelper";
import type { UserDto } from "../../models/users/UserDto";
import type { UserRole } from "../../types/users/UserRole";
import type { UserFollowStatus } from "../../types/users/UserFollowStatus";
import type { CommunityMemberRole } from "../../types/communities/CommunityMemberRole";
import { RoleBadge } from "../ui/UI";

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

  const imageUrl = ImageHelper.getImageUrl(user.image);
  const initial = user.username[0]?.toUpperCase() ?? "U";

  const followStatus = user.followStatus as UserFollowStatus | null;

  const isSelf = followStatus === "self";

  const followLabel = followLoading
    ? "Loading..."
    : followStatus === "following"
      ? "Unfollow"
      : "Follow";

  const followDisabled = followLoading;

  const followClass =
    followStatus === "following"
      ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
      : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15";

  const communityRoleLabel =
    communityRole === "moderator" ? "Moderator" : "Member";

  const nextCommunityRole: CommunityMemberRole =
    communityRole === "moderator" ? "member" : "moderator";

  const communityRoleButtonLabel =
    communityRole === "moderator" ? "Demote" : "Promote";
  return (
    <article
      onClick={() => navigate(`/users/${user.id}`)}
      className="group h-full cursor-pointer rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-5 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-[#0e1520]/90"
    >
      <div className="flex items-start gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={user.username}
            className="h-14 w-14 shrink-0 rounded-2xl border border-white/10 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10">
            <span className="text-lg font-bold text-sky-200">{initial}</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-semibold text-white">
                  {user.username}
                </h2>

                {!showCommunityMeta && <RoleBadge role={user.role} />}

                {showCommunityMeta && isCommunityOwner && (
                  <span className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                    Owner
                  </span>
                )}

                {showCommunityMeta && communityRole && (
                  <span
                    className={`rounded-xl border px-2.5 py-1 text-[11px] font-semibold ${
                      communityRole === "moderator"
                        ? "border-sky-300/20 bg-sky-400/10 text-sky-100"
                        : "border-white/10 bg-white/5 text-white/45"
                    }`}
                  >
                    {communityRoleLabel}
                  </span>
                )}

                {showCommunityMeta && isCurrentUser && (
                  <span className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                    You
                  </span>
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
              <select
                value={user.role}
                disabled={roleLoading}
                onChange={(e) =>
                  onRoleChange?.(user.id, e.target.value as UserRole)
                }
                className="rounded-2xl border border-white/10 bg-[#07111f] px-3 py-2 text-xs font-semibold text-white/80 outline-none transition-all hover:border-sky-300/30 focus:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="user" className="bg-[#07111f] text-white">
                  user
                </option>

                <option value="admin" className="bg-[#07111f] text-white">
                  admin
                </option>
              </select>
            )}

            {showFollowAction && !isSelf && (
              <button
                type="button"
                disabled={followDisabled}
                onClick={() => {
                  if (followStatus === "following") {
                    onUnfollow?.(user.id);
                    return;
                  }

                  if (followStatus === "not_following") {
                    onFollow?.(user.id);
                  }
                }}
                className={`rounded-2xl border px-4 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${followClass}`}
              >
                {followLabel}
              </button>
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
              <>
                <button
                  type="button"
                  disabled={communityActionLoading}
                  onClick={() =>
                    onCommunityRoleChange?.(user.id, nextCommunityRole)
                  }
                  className={`rounded-2xl border px-4 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    communityRole === "moderator"
                      ? "border-amber-400/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15"
                      : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15"
                  }`}
                >
                  {communityActionLoading
                    ? "Saving..."
                    : communityRoleButtonLabel}
                </button>

                <button
                  type="button"
                  disabled={communityActionLoading}
                  onClick={() => onRemoveCommunityMember?.(user.id)}
                  className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-200 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {communityActionLoading ? "Removing..." : "Remove"}
                </button>
              </>
            )}

            {!showRoleControl &&
              (!showFollowAction || isSelf) &&
              !showRemoveFollowerAction &&
              !showCommunityMemberActions && (
                <span className="text-xs text-white/25">View profile</span>
              )}
          </div>
        </div>
      </div>
    </article>
  );
}
