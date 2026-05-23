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

export function useAdminTagList(initialPage = 1, initialLimit = 10) {
  const [tags, setTags] = useState<PaginatedListDto<TagDto>>(
    createEmptyTags(initialPage, initialLimit),
  );

  const [page, setPageState] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadTagsForPage = async () => {
      try {
        const res = await tagApi.getAll(page, limit);

        if (cancelled) return;

        if (!res.success || !res.data) {
          setListError(res.message ?? TagMessages.fetchAllFailed);
          setTags(createEmptyTags(page, limit));
          return;
        }

        setListError("");
        setTags(res.data);
      } catch {
        if (!cancelled) {
          setListError(TagMessages.fetchAllFailed);
          setTags(createEmptyTags(page, limit));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTagsForPage();

    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  const reloadTags = useCallback(
    async (targetPage = page) => {
      setLoading(true);

      try {
        const res = await tagApi.getAll(targetPage, limit);

        if (!res.success || !res.data) {
          setListError(res.message ?? TagMessages.fetchAllFailed);
          setTags(createEmptyTags(targetPage, limit));
          return;
        }

        setListError("");
        setTags(res.data);
      } catch {
        setListError(TagMessages.fetchAllFailed);
        setTags(createEmptyTags(targetPage, limit));
      } finally {
        setLoading(false);
      }
    },
    [page, limit],
  );

  const setPage = (nextPage: number) => {
    if (nextPage === page) return;

    setLoading(true);
    setPageState(nextPage);
  };

  return {
    tags,
    page,
    limit,
    loading,
    listError,
    setPage,
    reloadTags,
    setPageState,
  };
}