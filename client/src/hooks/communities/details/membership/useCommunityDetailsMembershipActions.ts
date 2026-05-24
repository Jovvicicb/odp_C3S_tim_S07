import type { Dispatch, SetStateAction } from "react";

import { useToast } from "../../../toast/useToast";
import { useCommunityMembership } from "../../shared/useCommunityMembership";

import type { CommunityDetailsDto } from "../../../../models/communities/CommunityDetailsDto";

type Props = {
  setDetails: Dispatch<SetStateAction<CommunityDetailsDto | null>>;
  reload: () => Promise<void>;
};

export function useCommunityDetailsMembershipActions({
  setDetails,
  reload,
}: Props) {
  const { showToast } = useToast();

  const {
    joinCommunity,
    leaveCommunity,
    loadingCommunityId,
    error: membershipError,
  } = useCommunityMembership();

  const handleJoin = async (communityId: number) => {
    const message = await joinCommunity(communityId);

    if (!message) {
      return;
    }

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

    if (!message) {
      return;
    }

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

  return {
    handleJoin,
    handleLeave,
    loadingCommunityId,
    membershipError,
  };
}