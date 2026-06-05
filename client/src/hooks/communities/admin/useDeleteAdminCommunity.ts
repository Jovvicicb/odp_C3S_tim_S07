import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { communityApi } from "../../../api_services/communities/CommunityAPIService";
import { CommonMessages } from "../../../constants/messages/common/CommonMessages";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";
import type { CommunityDto } from "../../../models/communities/CommunityDto";
import { useToast } from "../../toast/useToast";

type Props = {
  communities: CommunityDto[];
  page: number;
  setCommunities: Dispatch<SetStateAction<CommunityDto[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export function useDeleteAdminCommunity({
  communities,
  page,
  setCommunities,
  setTotal,
  setPage,
}: Props) {
  const { showToast } = useToast();

  const [loadingCommunityId, setLoadingCommunityId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");

  const handleDeleteCommunity = async (communityId: number) => {
    setLoadingCommunityId(communityId);
    setError("");

    try {
      const res = await communityApi.delete(communityId);

      if (!res.success) {
        setError(res.message ?? CommunityMessages.deleteFailed);
        return;
      }

      setCommunities((current) =>
        current.filter((community) => community.id !== communityId),
      );

      setTotal((current) => Math.max(0, current - 1));

      showToast({
        type: "success",
        message: res.message ?? CommunityMessages.deleted,
      });

      if (communities.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch {
      setError(CommonMessages.unexpectedError);
    } finally {
      setLoadingCommunityId(null);
    }
  };

  return {
    handleDeleteCommunity,
    loadingCommunityId,
    error,
  };
}