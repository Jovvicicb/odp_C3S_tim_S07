import type { Dispatch, SetStateAction } from "react";

import { useToast } from "../../toast/useToast";

import type { CommunityDto } from "../../../models/communities/CommunityDto";
import { useCommunityMembership } from "../shared/useCommunityMembership";

type Props = {
  setCommunities: Dispatch<SetStateAction<CommunityDto[]>>;
};

export function useDiscoverCommunityActions({ setCommunities }: Props) {
  const { showToast } = useToast();

  const {
    joinCommunity,
    leaveCommunity,
    loadingCommunityId,
    error: membershipError,
  } = useCommunityMembership();

  const handleJoin = async (communityId: number) => {
    const message = await joinCommunity(communityId);

    if (!message) return;

    setCommunities((current) =>
      current.map((community) =>
        community.id === communityId
          ? {
              ...community,
              membershipStatus:
                community.type === "public" ? "active" : "pending",
            }
          : community,
      ),
    );

    showToast({
      type: "success",
      message,
    });
  };

  const handleLeave = async (communityId: number) => {
    const message = await leaveCommunity(communityId);

    if (!message) return;

    setCommunities((current) =>
      current.map((community) =>
        community.id === communityId
          ? {
              ...community,
              membershipStatus: null,
            }
          : community,
      ),
    );

    showToast({
      type: "success",
      message,
    });
  };

  return {
    handleJoin,
    handleLeave,
    loadingCommunityId,
    membershipError,
  };
}