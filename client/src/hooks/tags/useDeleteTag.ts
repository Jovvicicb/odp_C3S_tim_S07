import { useState } from "react";
import { tagApi } from "../../api_services/tags/TagAPIService";
import { TagMessages } from "../../constants/messages/tag/TagMessages";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { TagDto } from "../../models/tags/TagDto";
import { useToast } from "../toast/useToast";

type Props = {
  tags: PaginatedListDto<TagDto>;
  currentPage: number;
  reloadTags: (targetPage?: number) => Promise<void>;
  setPageState: (page: number) => void;
};

export function useDeleteTag({
  tags,
  currentPage,
  reloadTags,
  setPageState,
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
        setDeleteError(res.message ?? TagMessages.deleteFailed);
        return;
      }

      showToast({
        type: "success",
        message: res.message ?? TagMessages.deleteSuccess,
      });

      const shouldGoToPreviousPage = tags.items.length === 1 && currentPage > 1;
      const nextPage = shouldGoToPreviousPage ? currentPage - 1 : currentPage;

      if (nextPage !== currentPage) {
        setPageState(nextPage);
      } else {
        await reloadTags(nextPage);
      }
    } catch {
      setDeleteError(TagMessages.deleteFailed);
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