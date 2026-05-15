import { useCallback, useEffect, useState } from "react";
import { communityApi } from "../../api_services/community/CommunityAPIService";
import { CommunityMessages } from "../../constants/messages/community/CommunityMessages";
import type { CommunityDto } from "../../models/community/CommunityDto";

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
    []
  );

  useEffect(() => {
    queueMicrotask(() => {
      void fetchCommunities(page, limit);
    });
  }, [page, limit, fetchCommunities]);

  return {
    communities,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    setLimit,
    reload: () => fetchCommunities(page, limit),
  };
}