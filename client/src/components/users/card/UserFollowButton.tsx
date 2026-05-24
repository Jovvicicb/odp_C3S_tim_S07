import type { UserFollowStatus } from "../../../types/users/UserFollowStatus";

type Props = {
  userId: number;
  followStatus: UserFollowStatus | null;
  loading?: boolean;
  onFollow?: (userId: number) => void;
  onUnfollow?: (userId: number) => void;
};

export function UserFollowButton({
  userId,
  followStatus,
  loading = false,
  onFollow,
  onUnfollow,
}: Props) {
  if (followStatus === "self") {
    return null;
  }

  const label = loading
    ? "Loading..."
    : followStatus === "following"
      ? "Unfollow"
      : "Follow";

  const className =
    followStatus === "following"
      ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
      : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15";

  const handleClick = () => {
    if (followStatus === "following") {
      onUnfollow?.(userId);
      return;
    }

    if (followStatus === "not_following") {
      onFollow?.(userId);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className={`rounded-2xl border px-4 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {label}
    </button>
  );
}
