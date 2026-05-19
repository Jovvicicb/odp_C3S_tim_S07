import { UserCard } from "../UserCard";
import type { UserDto } from "../../../models/user/UserDto";

type Props = {
  followers: UserDto[];
  canRemoveFollowers: boolean;
  removeLoadingUserId: number | null;
  onRemoveFollower: (userId: number) => void;
};

export function FollowersList({
  followers,
  canRemoveFollowers,
  removeLoadingUserId,
  onRemoveFollower,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {followers.map((follower) => (
        <UserCard
          key={follower.id}
          user={follower}
          showRemoveFollowerAction={canRemoveFollowers}
          removeFollowerLoading={removeLoadingUserId === follower.id}
          onRemoveFollower={onRemoveFollower}
        />
      ))}
    </div>
  );
}
