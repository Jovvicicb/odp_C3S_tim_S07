import type { Dispatch, SetStateAction } from "react";

import { useToast } from "../../toast/useToast";
import { useUserFollow } from "../useUserFollow";
import type { UserDto } from "../../../models/user/UserDto";

type Props = {
  users: UserDto[];
  page: number;
  isMyFollowingPage: boolean;
  setUsers: Dispatch<SetStateAction<UserDto[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export function useFollowingActions({
  users,
  page,
  isMyFollowingPage,
  setUsers,
  setTotal,
  setPage,
}: Props) {
  const { showToast } = useToast();

  const {
    unfollow,
    loadingUserId: followLoadingUserId,
    error: followError,
  } = useUserFollow();

  const handleUnfollow = async (followingId: number) => {
    const message = await unfollow(followingId);

    if (!message) return;

    if (isMyFollowingPage) {
      setUsers((current) =>
        current.filter((user) => user.id !== followingId),
      );

      setTotal((current) => Math.max(0, current - 1));

      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } else {
      setUsers((current) =>
        current.map((user) =>
          user.id === followingId
            ? {
                ...user,
                followStatus: "not_following",
              }
            : user,
        ),
      );
    }

    showToast({
      type: "success",
      message,
    });
  };

  return {
    handleUnfollow,
    followLoadingUserId,
    followError,
  };
}