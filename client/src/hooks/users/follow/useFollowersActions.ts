import type { Dispatch, SetStateAction } from "react";

import { useToast } from "../../toast/useToast";
import { useRemoveFollower } from "./useRemoveFollower";
import type { UserDto } from "../../../models/users/UserDto";

type Props = {
  users: UserDto[];
  page: number;
  setUsers: Dispatch<SetStateAction<UserDto[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export function useFollowersActions({
  users,
  page,
  setUsers,
  setTotal,
  setPage,
}: Props) {
  const { showToast } = useToast();

  const {
    removeFollower,
    loadingUserId: removeLoadingUserId,
    error: removeError,
  } = useRemoveFollower();

  const handleRemoveFollower = async (followerId: number) => {
    const message = await removeFollower(followerId);

    if (!message) return;

    setUsers((current) => current.filter((user) => user.id !== followerId));

    setTotal((current) => Math.max(0, current - 1));

    showToast({
      type: "success",
      message,
    });

    if (users.length === 1 && page > 1) {
      setPage(page - 1);
    }
  };

  return {
    handleRemoveFollower,
    removeLoadingUserId,
    removeError,
  };
}