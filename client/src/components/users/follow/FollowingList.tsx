import { UserCard } from "../card/UserCard";
import type { UserDto } from "../../../models/users/UserDto";

type Props = {
  followingUsers: UserDto[];
  followLoadingUserId: number | null;
  onUnfollow: (userId: number) => void;
};

export function FollowingList({
  followingUsers,
  followLoadingUserId,
  onUnfollow,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {followingUsers.map((following) => (
        <UserCard
          key={following.id}
          user={{
            ...following,
            followStatus: "following",
          }}
          showFollowAction
          followLoading={followLoadingUserId === following.id}
          onUnfollow={onUnfollow}
        />
      ))}
    </div>
  );
}
