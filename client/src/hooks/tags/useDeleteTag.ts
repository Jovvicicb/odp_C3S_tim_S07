import { useState } from "react";

import { tagApi } from "../../api_services/tags/TagAPIService";
import { TagMessages } from "../../constants/messages/tag/TagMessages";
import { useToast } from "../toast/useToast";

import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { TagDto } from "../../models/tags/TagDto";

type Props = {
  tags: PaginatedListDto<TagDto>;
  page: number;
  setPage: (page: number) => void;
  setTags: React.Dispatch<React.SetStateAction<PaginatedListDto<TagDto>>>;
  reloadTags: (targetPage?: number, delayMs?: number) => Promise<void>;
};

export function useDeleteTag({
  tags,
  page,
  setPage,
  setTags,
  reloadTags,
}: Props) {
  const { showToast } = useToast();

  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const deleteTag = async (id: number) => {
    setLoadingDeleteId(id);
    setDeleteError("");

    try {
      const res = await tagApi.delete(id);

      if (!res.success) {
        const message = res.message ?? TagMessages.deleteFailed;

        setDeleteError(message);

        showToast({
          type: "error",
          message,
        });

        return;
      }

      showToast({
        type: "success",
        message: res.message ?? TagMessages.deleteSuccess,
      });

      const shouldGoToPreviousPage = tags.items.length === 1 && page > 1;
      const nextPage = shouldGoToPreviousPage ? page - 1 : page;

      if (shouldGoToPreviousPage) {
        setPage(nextPage);
        return;
      }

      setTags((current) => ({
        ...current,
        items: current.items.filter((tag) => tag.id !== id),
        total: Math.max(0, current.total - 1),
      }));

      await reloadTags(nextPage, 300);
    } catch {
      setDeleteError(TagMessages.deleteFailed);

      showToast({
        type: "error",
        message: TagMessages.deleteFailed,
      });
    } finally {
      setLoadingDeleteId(null);
    }
  };

  return {
    deleteTag,
    loadingDeleteId,
    deleteError,
  };
}