import { useCallback, useEffect, useState } from "react";
import { communityApi } from "../../../api_services/communities/CommunityAPIService";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";
import type { CommunityDetailsDto } from "../../../models/communities/CommunityDetailsDto";

export function useCommunityDetails(
  communityId: number | null,
  membersPage = 1,
  membersLimit = 10,
) {
  const [details, setDetails] = useState<CommunityDetailsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDetails = useCallback(async () => {
    if (!communityId) {
      setDetails(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await communityApi.getById(
        communityId,
        membersPage,
        membersLimit,
      );

      if (!res.success || !res.data) {
        setDetails(null);
        setError(res.message ?? CommunityMessages.fetchOneFailed);
        return;
      }

      setDetails(res.data);
    } catch {
      setDetails(null);
      setError(CommunityMessages.fetchOneFailed);
    } finally {
      setLoading(false);
    }
  }, [communityId, membersPage, membersLimit]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchDetails();
    });
  }, [fetchDetails]);

  return {
    details,
    setDetails,
    loading,
    error,
    reload: fetchDetails,
  };
}