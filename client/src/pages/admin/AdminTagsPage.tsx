import { ErrorBox } from "../../components/ui/feedback/ErrorBox";
import { PageHeader } from "../../components/ui/layout/PageHeader";

import { AdminTagForm } from "../../components/admin/tags/AdminTagForm";
import { AdminTagsSection } from "../../components/admin/tags/AdminTagsSection";

import { ActionButton } from "../../components/ui/button/ActionButton";

import { useAdminTagList } from "../../hooks/tags/useAdminTagList";
import { useCreateTag } from "../../hooks/tags/useCreateTag";
import { useDeleteTag } from "../../hooks/tags/useDeleteTag";

export default function AdminTagsPage() {
  const {
    tags,
    setTags,
    loading,
    listError,
    page,
    limit,
    total,
    setPage,
    setTotal,
  } = useAdminTagList(1, 10);

  const { createTag, loadingCreate, createError } = useCreateTag({
    page,
    limit,
    setTags,
    setTotal,
    setPage,
  });

  const { deleteTag, loadingDeleteId, deleteError } = useDeleteTag({
    tags,
    page,
    setTags,
    setTotal,
    setPage,
  });

  const error = listError || createError || deleteError;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin panel"
        title="Global tags"
        action={<ActionButton variant="back" label="Back" />}
      />

      {error && <ErrorBox message={error} />}

      <AdminTagForm loading={loadingCreate} onSubmit={createTag} />

      <AdminTagsSection
        tags={tags}
        page={page}
        limit={limit}
        total={total}
        loading={loading}
        loadingDeleteId={loadingDeleteId}
        onPageChange={setPage}
        onDelete={deleteTag}
      />
    </div>
  );
}
