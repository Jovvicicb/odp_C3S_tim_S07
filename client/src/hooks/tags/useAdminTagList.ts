import { useCallback, useEffect, useState } from "react";

import { tagApi } from "../../api_services/tags/TagAPIService";
import { TagMessages } from "../../constants/messages/tag/TagMessages";

import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { TagDto } from "../../models/tags/TagDto";

const createEmptyTags = (
  page: number,
  limit: number,
): PaginatedListDto<TagDto> => ({
  items: [],
  total: 0,
  page,
  limit,
});

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export function useAdminTagList(initialPage = 1, initialLimit = 10) {
  const [tags, setTags] = useState<PaginatedListDto<TagDto>>(
    createEmptyTags(initialPage, initialLimit),
  );

  const [page, setPageState] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const loadTags = useCallback(
    async (targetPage: number, signal?: AbortSignal, delayMs = 0) => {
      setLoading(true);

      if (delayMs > 0) {
        await wait(delayMs);
      }

      if (signal?.aborted) return;

      try {
        const res = await tagApi.getAll(targetPage, limit);

        if (signal?.aborted) return;

        if (!res.success || !res.data) {
          setListError(res.message ?? TagMessages.fetchAllFailed);
          setTags(createEmptyTags(targetPage, limit));
          return;
        }

        setListError("");
        setTags(res.data);
      } catch {
        if (signal?.aborted) return;

        setListError(TagMessages.fetchAllFailed);
        setTags(createEmptyTags(targetPage, limit));
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [limit],
  );

  useEffect(() => {
    const controller = new AbortController();

    queueMicrotask(() => {
      void loadTags(page, controller.signal);
    });

    return () => {
      controller.abort();
    };
  }, [page, loadTags]);

  const reloadTags = useCallback(
    async (targetPage = page, delayMs = 0) => {
      await loadTags(targetPage, undefined, delayMs);
    },
    [page, loadTags],
  );

  const setPage = (nextPage: number) => {
    if (nextPage === page) return;

    setPageState(nextPage);
  };

  return {
    tags,
    setTags,
    page,
    limit,
    loading,
    listError,
    setPage,
    reloadTags,
  };
}