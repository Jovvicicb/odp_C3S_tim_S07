import type { Dispatch, SetStateAction } from "react";

import { useToast } from "../../toast/useToast";
import { useUserFollow } from "../follow/useUserFollow";
import type { UserDto } from "../../../models/users/UserDto";

type Props = {
  setUsers: Dispatch<SetStateAction<UserDto[]>>;
};

export function useSearchUsersActions({ setUsers }: Props) {
  const { showToast } = useToast();

  const {
    follow,
    unfollow,
    loadingUserId,
    error: followError,
  } = useUserFollow();

  const handleFollow = async (userId: number) => {
    const message = await follow(userId);

    if (!message) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              followStatus: "following",
            }
          : user,
      ),
    );

    showToast({
      type: "success",
      message,
    });
  };

  const handleUnfollow = async (userId: number) => {
    const message = await unfollow(userId);

    if (!message) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              followStatus: "not_following",
            }
          : user,
      ),
    );

    showToast({
      type: "success",
      message,
    });
  };

  return {
    handleFollow,
    handleUnfollow,
    loadingUserId,
    followError,
  };
}