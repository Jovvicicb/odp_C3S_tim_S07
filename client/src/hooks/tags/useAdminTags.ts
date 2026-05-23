import { useAdminTagList } from "./useAdminTagList";
import { useCreateTag } from "./useCreateTag";
import { useDeleteTag } from "./useDeleteTag";

export function useAdminTags(initialPage = 1, initialLimit = 10) {
  const list = useAdminTagList(initialPage, initialLimit);

  const create = useCreateTag({
    currentPage: list.page,
    reloadTags: list.reloadTags,
    setPageState: list.setPageState,
  });

  const remove = useDeleteTag({
    tags: list.tags,
    currentPage: list.page,
    reloadTags: list.reloadTags,
    setPageState: list.setPageState,
  });

  return {
    tags: list.tags,
    page: list.page,
    limit: list.limit,
    loading: list.loading,
    loadingCreate: create.loadingCreate,
    loadingDeleteId: remove.loadingDeleteId,

    error: list.listError || create.createError || remove.deleteError,

    setPage: list.setPage,
    createTag: create.createTag,
    deleteTag: remove.deleteTag,
  };
}