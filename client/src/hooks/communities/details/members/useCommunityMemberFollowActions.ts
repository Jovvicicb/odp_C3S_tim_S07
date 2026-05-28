import type { Dispatch, SetStateAction } from "react";

import { useToast } from "../../../toast/useToast";
import { useUserFollow } from "../../../users/follow/useUserFollow";

import type { CommunityDetailsDto } from "../../../../models/communities/CommunityDetailsDto";

type Props = {
  setDetails: Dispatch<SetStateAction<CommunityDetailsDto | null>>;
};

export function useCommunityMemberFollowActions({ setDetails }: Props) {
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

    setDetails((current) =>
      current
        ? {
            ...current,
            members: current.members
              ? {
                  ...current.members,
                  items: current.members.items.map((member) =>
                    member.user.id === userId
                      ? {
                          ...member,
                          user: {
                            ...member.user,
                            followStatus: "following",
                          },
                        }
                      : member,
                  ),
                }
              : current.members,
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

    setDetails((current) =>
      current
        ? {
            ...current,
            members: current.members
              ? {
                  ...current.members,
                  items: current.members.items.map((member) =>
                    member.user.id === userId
                      ? {
                          ...member,
                          user: {
                            ...member.user,
                            followStatus: "not_following",
                          },
                        }
                      : member,
                  ),
                }
              : current.members,
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