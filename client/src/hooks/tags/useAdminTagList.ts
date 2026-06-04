import { useCallback, useEffect, useState } from "react";

import { tagApi } from "../../api_services/tags/TagAPIService";
import { TagMessages } from "../../constants/messages/tag/TagMessages";

import type { TagDto } from "../../models/tags/TagDto";

export function useAdminTagList(initialPage = 1, initialLimit = 10) {
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setListError("");

    try {
      const res = await tagApi.getAll(page, limit);

      if (!res.success || !res.data) {
        setTags([]);
        setTotal(0);
        setListError(res.message ?? TagMessages.fetchAllFailed);
        return;
      }

      setTags(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch {
      setTags([]);
      setTotal(0);
      setListError(TagMessages.fetchAllFailed);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchTags();
    });
  }, [fetchTags]);

  return {
    tags,
    setTags,
    loading,
    listError,
    page,
    limit,
    total,
    setPage,
    setLimit,
    setTotal,
    reload: fetchTags,
  };
}