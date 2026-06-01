import { useCallback, useEffect, useState } from "react";

import { communityApi } from "../../../api_services/communities/CommunityAPIService";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";
import type { CommunityDto } from "../../../models/communities/CommunityDto";

export function usePublicCommunities(initialPage = 1, initialLimit = 6) {
  const [communities, setCommunities] = useState<CommunityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await communityApi.getPublic(page, limit);

      if (!res.success || !res.data) {
        setCommunities([]);
        setTotal(0);
        setError(res.message ?? CommunityMessages.fetchPublicFailed);
        return;
      }

      setCommunities(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch {
      setCommunities([]);
      setTotal(0);
      setError(CommunityMessages.fetchPublicFailed);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return {
    communities,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    reload: load,
  };
}