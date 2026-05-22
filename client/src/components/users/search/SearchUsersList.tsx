import { UserCard } from "../UserCard";
import type { UserDto } from "../../../models/users/UserDto";

type Props = {
  users: UserDto[];
  loadingUserId: number | null;
  onFollow: (userId: number) => void;
  onUnfollow: (userId: number) => void;
};

export function SearchUsersList({
  users,
  loadingUserId,
  onFollow,
  onUnfollow,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          showFollowAction
          followLoading={loadingUserId === user.id}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
        />
      ))}
    </div>
  );
}
