import { useCallback, useEffect, useMemo, useState } from "react";

import { commentApi } from "../../../api_services/comments/CommentAPIService";
import { CommentMessages } from "../../../constants/messages/comment/CommentMessages";
import type { UserProfileCommentDto } from "../../../models/comments/UserProfileCommentDto";

export function useUserComments(
  userId?: number,
  enabled = true,
  initialPage = 1,
  limit = 10,
) {
  const [comments, setComments] = useState<UserProfileCommentDto[]>([]);
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
    if (!enabled || !userId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await commentApi.getByUser(userId, page, limit);

      if (!res.success || !res.data) {
        setComments([]);
        setTotal(0);
        setError(res.message ?? CommentMessages.fetchByUserFailed);
        return;
      }

      setComments(res.data.items);
      setTotal(res.data.total);
    } catch {
      setComments([]);
      setTotal(0);
      setError(CommentMessages.fetchByUserFailed);
    } finally {
      setLoading(false);
    }
  }, [userId, enabled, page, limit]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return {
    comments,
    setComments,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    reload: load,
  };
}