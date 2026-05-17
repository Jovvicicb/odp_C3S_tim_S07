import { useNavigate } from "react-router-dom";
import { ImageHelper } from "../../helpers/images/ImageHelper";
import type { UserDto } from "../../models/user/UserDto";
import type { UserRole } from "../../types/user/UserRole";
import type { UserFollowStatus } from "../../types/user/UserFollowStatus";
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
}: Props) {
  const navigate = useNavigate();

  const imageUrl = ImageHelper.getImageUrl(user.image);
  const initial = user.username[0]?.toUpperCase() ?? "U";

  const followStatus = user.followStatus as UserFollowStatus | null;

  const followLabel = followLoading
    ? "Loading..."
    : followStatus === "self"
      ? "You"
      : followStatus === "following"
        ? "Unfollow"
        : "Follow";

  const followDisabled = followLoading || followStatus === "self";

  const followClass =
    followStatus === "following"
      ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
      : followStatus === "self"
        ? "border-white/10 bg-white/4 text-white/35"
        : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15";

  return (
    <article
      onClick={() => navigate(`/users/${user.id}`)}
      className="group h-full cursor-pointer rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-5 shadow-xl shadow-sky-950/10 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-[#0e1520]/90"
    >
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={user.username}
            className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10">
            <span className="text-lg font-bold text-sky-200">{initial}</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="truncate text-base font-semibold text-white">
              {user.username}
            </h2>

            <RoleBadge role={user.role} />
          </div>

          <p className="mt-1 truncate text-sm text-white/40">{user.email}</p>

          {user.fullname && (
            <p className="mt-1 truncate text-xs text-white/30">
              {user.fullname}
            </p>
          )}
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex shrink-0 items-center gap-3"
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

          {showFollowAction && (
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

          <span className="text-white/25 transition-colors group-hover:text-sky-200">
            →
          </span>
        </div>
      </div>
    </article>
  );
}
