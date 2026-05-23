import { useState } from "react";
import { tagApi } from "../../api_services/tags/TagAPIService";
import { TagMessages } from "../../constants/messages/tag/TagMessages";
import { validateCreateTag } from "../../validators/tag/validateCreateTag";
import { useToast } from "../toast/useToast";

type Props = {
  currentPage: number;
  reloadTags: (targetPage?: number) => Promise<void>;
  setPageState: (page: number) => void;
};

export function useCreateTag({
  currentPage,
  reloadTags,
  setPageState,
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

      if (!res.success) {
        setCreateError(res.message ?? TagMessages.createFailed);
        return false;
      }

      showToast({
        type: "success",
        message: res.message ?? TagMessages.createSuccess,
      });

      if (currentPage !== 1) {
        setPageState(1);
      } else {
        await reloadTags(1);
      }

      return true;
    } catch {
      setCreateError(TagMessages.createFailed);
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