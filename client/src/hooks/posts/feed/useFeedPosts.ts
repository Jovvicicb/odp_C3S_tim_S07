import { useCallback, useEffect, useState } from "react";

import { postApi } from "../../../api_services/posts/PostAPIService";
import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";

export function useFeedPosts(initialPage = 1, initialLimit = 10) {
  const [posts, setPosts] = useState<PostWithDetailsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await postApi.getFeed(page, limit);

      if (!res.success || !res.data) {
        setError(res.message ?? "Failed to fetch feed posts");
        setPosts([]);
        setTotal(0);
        return;
      }

      setPosts(res.data.items);
      setTotal(res.data.total);
    } catch {
      setError("Failed to fetch feed posts");
      setPosts([]);
      setTotal(0);
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
    posts,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    reload: load,
  };
}