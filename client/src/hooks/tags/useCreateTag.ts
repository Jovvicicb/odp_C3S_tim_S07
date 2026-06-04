import { useState } from "react";

import { tagApi } from "../../api_services/tags/TagAPIService";
import { TagMessages } from "../../constants/messages/tag/TagMessages";
import { validateCreateTag } from "../../validators/tag/validateCreateTag";
import { useToast } from "../toast/useToast";

import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { TagDto } from "../../models/tags/TagDto";

type Props = {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setTags: React.Dispatch<React.SetStateAction<PaginatedListDto<TagDto>>>;
  reloadTags: (targetPage?: number, delayMs?: number) => Promise<void>;
};

export function useCreateTag({
  page,
  limit,
  setPage,
  setTags,
  reloadTags,
}: Props) {
  const { showToast } = useToast();

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [createError, setCreateError] = useState("");

  const createTag = async (name: string) => {
    const validation = validateCreateTag({ name });

    if (!validation.valid || !validation.normalizedName) {
      setCreateError(validation.message);
      return false;
    }

    setLoadingCreate(true);
    setCreateError("");

    try {
      const res = await tagApi.create(validation.normalizedName);

      if (!res.success || !res.data) {
        const message = res.message ?? TagMessages.createFailed;

        setCreateError(message);

        showToast({
          type: "error",
          message,
        });

        return false;
      }

      showToast({
        type: "success",
        message: res.message ?? TagMessages.createSuccess,
      });

      if (page !== 1) {
        setPage(1);
        return true;
      }

      setTags((current) => {
        const nextItems = [res.data!, ...current.items]
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, limit);

        return {
          ...current,
          items: nextItems,
          total: current.total + 1,
        };
      });

      await reloadTags(1, 300);

      return true;
    } catch {
      setCreateError(TagMessages.createFailed);

      showToast({
        type: "error",
        message: TagMessages.createFailed,
      });

      return false;
    } finally {
      setLoadingCreate(false);
    }
  };

  return {
    createTag,
    loadingCreate,
    createError,
  };
}