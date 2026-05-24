import { useState } from "react";
import { communityApi } from "../../../api_services/communities/CommunityAPIService";
import { CommonMessages } from "../../../constants/messages/common/CommonMessages";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";

export function useCommunityMembership() {
  const [loadingCommunityId, setLoadingCommunityId] = useState<number | null>(
    null,
  );

  const [error, setError] = useState("");

  const joinCommunity = async (communityId: number) => {
    setLoadingCommunityId(communityId);
    setError("");

    try {
      const res = await communityApi.join(communityId);

      if (!res.success) {
        setError(res.message ?? CommunityMessages.joinFailed);
        return null;
      }

      return res.message || CommunityMessages.joined;
    } catch {
      setError(CommonMessages.unexpectedError);
      return null;
    } finally {
      setLoadingCommunityId(null);
    }
  };

  const leaveCommunity = async (communityId: number) => {
    setLoadingCommunityId(communityId);
    setError("");

    try {
      const res = await communityApi.leave(communityId);

      if (!res.success) {
        setError(res.message ?? CommunityMessages.leaveFailed);
        return null;
      }

      return res.message || CommunityMessages.left;
    } catch {
      setError(CommonMessages.unexpectedError);
      return null;
    } finally {
      setLoadingCommunityId(null);
    }
  };

  return {
    joinCommunity,
    leaveCommunity,
    loadingCommunityId,
    error,
    setError,
  };
}