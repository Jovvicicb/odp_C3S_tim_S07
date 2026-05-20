import { useCallback, useEffect, useState } from "react";
import { communityApi } from "../../../api_services/community/CommunityAPIService";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";
import type { CommunityMemberDetailsDto } from "../../../models/community/CommunityMemberDetailsDto";

export function useCommunityJoinRequests(
  communityId: number | null,
  enabled: boolean,
  initialPage = 1,
  initialLimit = 10,
) {
  const [requests, setRequests] = useState<CommunityMemberDetailsDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchRequests = useCallback(async () => {
    if (!enabled || !communityId) {
      setRequests([]);
      setTotal(0);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await communityApi.getJoinRequests(communityId, page, limit);

      if (!res.success || !res.data) {
        setRequests([]);
        setTotal(0);
        setError(res.message ?? CommunityMessages.joinRequestsFetchFailed);
        return;
      }

      setRequests(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch {
      setRequests([]);
      setTotal(0);
      setError(CommunityMessages.joinRequestsFetchFailed);
    } finally {
      setLoading(false);
    }
  }, [communityId, enabled, page, limit]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchRequests();
    });
  }, [fetchRequests]);

  return {
    requests,
    setRequests,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    setLimit,
    setTotal,
    reload: fetchRequests,
  };
}