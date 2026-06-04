import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { tagApi } from "../../api_services/tags/TagAPIService";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";
import { TagMessages } from "../../constants/messages/tag/TagMessages";
import { useToast } from "../toast/useToast";

import type { TagDto } from "../../models/tags/TagDto";

type Props = {
  tags: TagDto[];
  page: number;
  setTags: Dispatch<SetStateAction<TagDto[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export function useDeleteTag({
  tags,
  page,
  setTags,
  setTotal,
  setPage,
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

      setTags((current) => current.filter((tag) => tag.id !== id));

      setTotal((current) => Math.max(0, current - 1));

      showToast({
        type: "success",
        message: res.message ?? TagMessages.deleteSuccess,
      });

      if (tags.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch {
      setDeleteError(CommonMessages.unexpectedError);

      showToast({
        type: "error",
        message: CommonMessages.unexpectedError,
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