import { useCallback, useEffect, useState } from "react";

import { postApi } from "../../../api_services/posts/PostAPIService";
import { PostMessages } from "../../../constants/messages/post/PostMessages";

import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";

export function useAdminPosts(initialPage = 1, initialLimit = 10) {
  const [posts, setPosts] = useState<PostWithDetailsDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await postApi.getAllForAdmin(page, limit);

      if (!res.success || !res.data) {
        setPosts([]);
        setTotal(0);
        setError(res.message ?? PostMessages.fetchAdminPostsFailed);
        return;
      }

      setPosts(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch {
      setPosts([]);
      setTotal(0);
      setError(PostMessages.fetchAdminPostsFailed);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

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
    setPage,
    setLimit,
    setTotal,
    reload: fetchPosts,
  };
}