import { useCallback, useEffect, useState } from "react";

import { postApi } from "../../../api_services/posts/PostAPIService";
import { PostMessages } from "../../../constants/messages/post/PostMessages";
import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";

export function useUserPosts(userId?: number) {
  const [posts, setPosts] = useState<PostWithDetailsDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!userId) {
      setPosts([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await postApi.getByUser(userId);

      if (!res.success || !res.data) {
        setPosts([]);
        setError(res.message ?? PostMessages.fetchByUserFailed);
        return;
      }

      setPosts(res.data);
    } catch {
      setPosts([]);
      setError(PostMessages.fetchByUserFailed);
    } finally {
      setLoading(false);
    }
  }, [userId]);

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
    reload: load,
  };
}