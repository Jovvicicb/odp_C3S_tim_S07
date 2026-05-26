import type { UserFollowStatus } from "../../../types/users/UserFollowStatus";
import { Button } from "../../ui/button/Button";

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

  const isFollowing = followStatus === "following";

  const label = isFollowing ? "Unfollow" : "Follow";
  const variant = isFollowing ? "danger" : "primary";

  const handleClick = () => {
    if (isFollowing) {
      onUnfollow?.(userId);
      return;
    }

    onFollow?.(userId);
  };

  return (
    <Button
      label={label}
      loadingLabel="Loading..."
      loading={loading}
      variant={variant}
      size="sm"
      onClick={handleClick}
    />
  );
}
