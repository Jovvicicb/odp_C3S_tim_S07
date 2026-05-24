import { useCallback, useEffect, useState } from "react";
import { communityApi } from "../../../api_services/communities/CommunityAPIService";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";
import type { CommunityDto } from "../../../models/communities/CommunityDto";
import type { CommunityDiscoverType } from "../../../types/communities/common/CommunityDiscoverType";

export function useDiscoverCommunities(initialPage = 1, initialLimit = 10) {
  const [communities, setCommunities] = useState<CommunityDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const [type, setType] = useState<CommunityDiscoverType>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await communityApi.discover(
        page,
        limit,
        type,
        debouncedSearch,
      );

      if (!res.success || !res.data) {
        setCommunities([]);
        setTotal(0);
        setError(res.message ?? CommunityMessages.discoverFetchFailed);
        return;
      }

      setCommunities(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch {
      setCommunities([]);
      setTotal(0);
      setError(CommunityMessages.discoverFetchFailed);
    } finally {
      setLoading(false);
    }
  }, [page, limit, type, debouncedSearch]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchCommunities();
    });
  }, [fetchCommunities]);

  return {
    communities,
    setCommunities,
    loading,
    error,
    page,
    limit,
    total,
    type,
    search,
    setPage,
    setLimit,
    setType,
    setSearch,
    reload: fetchCommunities,
  };
}