import type { Dispatch, SetStateAction } from "react";

import { useToast } from "../../toast/useToast";

import type { CommunityDto } from "../../../models/communities/CommunityDto";
import { useCommunityMembership } from "../shared/useCommunityMembership";

type Props = {
  communities: CommunityDto[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setCommunities: Dispatch<SetStateAction<CommunityDto[]>>;
};

export function useMyCommunitiesActions({
  communities,
  page,
  setPage,
  setTotal,
  setCommunities,
}: Props) {
  const { showToast } = useToast();

  const {
    leaveCommunity,
    loadingCommunityId,
    error: membershipError,
  } = useCommunityMembership();

  const handleLeave = async (communityId: number) => {
    const message = await leaveCommunity(communityId);

    if (!message) return;

    setCommunities((current) =>
      current.filter((community) => community.id !== communityId),
    );

    setTotal((current) => Math.max(0, current - 1));

    showToast({
      type: "success",
      message,
    });

    if (communities.length === 1 && page > 1) {
      setPage(page - 1);
    }
  };

  return {
    handleLeave,
    loadingCommunityId,
    membershipError,
  };
}