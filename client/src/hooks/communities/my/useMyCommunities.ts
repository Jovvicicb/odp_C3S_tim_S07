import { useCallback, useEffect, useState } from "react";

import { communityApi } from "../../../api_services/communities/CommunityAPIService";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";
import type { CommunityDto } from "../../../models/communities/CommunityDto";

export function useMyCommunities(initialPage = 1, initialLimit = 10) {
  const [communities, setCommunities] = useState<CommunityDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchCommunities = useCallback(
    async (pageValue: number, limitValue: number) => {
      setLoading(true);
      setError("");

      try {
        const res = await communityApi.getMine(pageValue, limitValue);

        if (!res.success || !res.data) {
          setCommunities([]);
          setTotal(0);
          setError(res.message ?? CommunityMessages.fetchMineFailed);
          return;
        }

        setCommunities(res.data.items ?? []);
        setTotal(res.data.total ?? 0);
      } catch {
        setCommunities([]);
        setTotal(0);
        setError(CommunityMessages.fetchMineFailed);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reload = useCallback(async () => {
    await fetchCommunities(page, limit);
  }, [fetchCommunities, page, limit]);

  useEffect(() => {
    queueMicrotask(() => {
      void reload();
    });
  }, [reload]);

  return {
    communities,
    setCommunities,
    loading,
    error,
    page,
    limit,
    total,
    setTotal,
    setPage,
    setLimit,
    reload,
  };
}