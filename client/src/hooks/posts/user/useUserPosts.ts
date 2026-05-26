import { useCallback, useEffect, useMemo, useState } from "react";

import { postApi } from "../../../api_services/posts/PostAPIService";
import { PostMessages } from "../../../constants/messages/post/PostMessages";
import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";

export function useUserPosts(userId?: number, initialPage = 1, limit = 10) {
  const [posts, setPosts] = useState<PostWithDetailsDto[]>([]);
  const [pageByUserId, setPageByUserId] = useState<Record<number, number>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const page = useMemo(() => {
    if (!userId) {
      return initialPage;
    }

    return pageByUserId[userId] ?? initialPage;
  }, [userId, pageByUserId, initialPage]);

  const setPage = useCallback(
    (nextPage: number) => {
      if (!userId) {
        return;
      }

      setPageByUserId((current) => ({
        ...current,
        [userId]: nextPage,
      }));
    },
    [userId],
  );

  const load = useCallback(async () => {
    if (!userId) {
      setPosts([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await postApi.getByUser(userId, page, limit);

      if (!res.success || !res.data) {
        setPosts([]);
        setTotal(0);
        setError(res.message ?? PostMessages.fetchByUserFailed);
        return;
      }

      setPosts(res.data.items);
      setTotal(res.data.total);
    } catch {
      setPosts([]);
      setTotal(0);
      setError(PostMessages.fetchByUserFailed);
    } finally {
      setLoading(false);
    }
  }, [userId, page, limit]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return {
    posts,
    setPosts,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    reload: load,
  };
}