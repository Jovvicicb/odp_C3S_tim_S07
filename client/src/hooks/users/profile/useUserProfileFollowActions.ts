import type { Dispatch, SetStateAction } from "react";

import { useToast } from "../../toast/useToast";
import { useUserFollow } from "../useUserFollow";

import type { UserDto } from "../../../models/users/UserDto";

type Props = {
  setProfile: Dispatch<SetStateAction<UserDto | null>>;
};

export function useUserProfileFollowActions({ setProfile }: Props) {
  const { showToast } = useToast();

  const {
    follow,
    unfollow,
    loadingUserId,
    error: followError,
  } = useUserFollow();

  const handleFollow = async (userId: number) => {
    const message = await follow(userId);

    if (!message) {
      return;
    }

    setProfile((current) =>
      current && current.id === userId
        ? {
            ...current,
            followStatus: "following",
          }
        : current,
    );

    showToast({
      type: "success",
      message,
    });
  };

  const handleUnfollow = async (userId: number) => {
    const message = await unfollow(userId);

    if (!message) {
      return;
    }

    setProfile((current) =>
      current && current.id === userId
        ? {
            ...current,
            followStatus: "not_following",
          }
        : current,
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