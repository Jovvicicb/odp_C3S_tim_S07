import { useCallback, useEffect, useState } from "react";
import { postApi } from "../../../api_services/posts/PostAPIService";
import type { PostSortType } from "../../../types/posts/PostSortType";
import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";
import { PostMessages } from "../../../constants/messages/post/PostMessages";

export function useCommunityPosts(
  communityId: number | null,
  enabled: boolean,
  initialPage = 1,
  initialLimit = 10,
) {
  const [posts, setPosts] = useState<PostWithDetailsDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<PostSortType>("newest");

  const fetchPosts = useCallback(async () => {
    if (!enabled || !communityId) {
      setPosts([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await postApi.getByCommunity(communityId, page, limit, sort);

      if (!res.success || !res.data) {
        setPosts([]);
        setTotal(0);
        setError(res.message ?? PostMessages.fetchByCommunityFailed);
        return;
      }

      setPosts(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch {
      setPosts([]);
      setTotal(0);
      setError(PostMessages.fetchByCommunityFailed);
    } finally {
      setLoading(false);
    }
  }, [communityId, enabled, page, limit, sort]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchPosts();
    });
  }, [fetchPosts]);

  return {
    posts,
    setPosts,
    loading,
    error,
    page,
    limit,
    total,
    sort,
    setPage,
    setLimit,
    setSort,
    setTotal,
    reload: fetchPosts,
  };
}