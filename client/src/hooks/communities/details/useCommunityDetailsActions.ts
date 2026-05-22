import type { Dispatch, SetStateAction } from "react";
import { useToast } from "../../toast/useToast";
import { useCommunityMembership } from "../useCommunityMembership";
import { useUserFollow } from "../../users/useUserFollow";
import type { CommunityDetailsDto } from "../../../models/communities/CommunityDetailsDto";

type Props = {
  setDetails: Dispatch<SetStateAction<CommunityDetailsDto | null>>;
  reload: () => Promise<void>;
};

export function useCommunityDetailsActions({ setDetails, reload }: Props) {
  const { showToast } = useToast();

  const {
    joinCommunity,
    leaveCommunity,
    loadingCommunityId,
    error: membershipError,
  } = useCommunityMembership();

  const {
    follow,
    unfollow,
    loadingUserId,
    error: followError,
  } = useUserFollow();

  const handleJoin = async (communityId: number) => {
    const message = await joinCommunity(communityId);

    if (!message) return;

    setDetails((current) =>
      current
        ? {
            ...current,
            community: {
              ...current.community,
              membershipStatus:
                current.community.type === "public" ? "active" : "pending",
            },
            canViewContent:
              current.community.type === "public"
                ? true
                : current.canViewContent,
          }
        : current,
    );

    showToast({
      type: "success",
      message,
    });

    setTimeout(() => {
      void reload();
    }, 500);
  };

  const handleLeave = async (communityId: number) => {
    const message = await leaveCommunity(communityId);

    if (!message) return;

    setDetails((current) =>
      current
        ? {
            ...current,
            community: {
              ...current.community,
              membershipStatus: null,
            },
            canViewContent:
              current.community.type === "private"
                ? false
                : current.canViewContent,
          }
        : current,
    );

    showToast({
      type: "success",
      message,
    });

    setTimeout(() => {
      void reload();
    }, 500);
  };

  const handleFollow = async (userId: number) => {
    const message = await follow(userId);

    if (!message) return;

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

    if (!message) return;

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
    handleJoin,
    handleLeave,
    handleFollow,
    handleUnfollow,
    loadingCommunityId,
    loadingUserId,
    membershipError,
    followError,
  };
}