// TODO: Replace EntityDto and entityApi with your domain types and API service
import { useState, useEffect, useCallback } from "react";
import { communityApi } from "../../api_services/community/CommunityAPIService";
import type { CommunityDto } from "../../models/community/CommunityDto";


export function useCommunities(userId?: number,initialPage = 1, initialLimit = 10) {
  const [items, setItems]     = useState<CommunityDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = userId
        ? await communityApi.getByUserId(userId,page,limit)
        : await communityApi.getAll(page,limit);
      if (!res.success || !res.data) {
          setError(res.message ?? "Failed to load communities");
          setItems([]);
          setTotal(0);
          return;
        }
        setItems(res.data.items??[]);
        setTotal(res.data.total??0);

    } catch {
      setError("Failed to load communities");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [userId,page,limit]);

  useEffect(() => { load(); }, [load]);

  return {
    items,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    setLimit,
    reload: load,
  };
}
