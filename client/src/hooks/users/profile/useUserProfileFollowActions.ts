import type { Dispatch, SetStateAction } from "react";

import { useToast } from "../../toast/useToast";
import { useUserFollow } from "../follow/useUserFollow";

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

    setProfile((current) => {
      if (!current || current.id !== userId) {
        return current;
      }

      return {
        ...current,
        followStatus: "following",
        followersCount: current.followersCount + 1,
      };
    });

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

    setProfile((current) => {
      if (!current || current.id !== userId) {
        return current;
      }

      return {
        ...current,
        followStatus: "not_following",
        followersCount: Math.max(0, current.followersCount - 1),
      };
    });

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