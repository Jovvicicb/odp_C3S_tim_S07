import { ErrorBox, PageHeader } from "../../components/ui/UI";

import { AdminTagForm } from "../../components/admin/tags/AdminTagForm";
import { AdminTagsSection } from "../../components/admin/tags/AdminTagsSection";

import { useAdminTags } from "../../hooks/tags/useAdminTags";
import { ActionButton } from "../../components/ui/button/ActionButton";

export default function AdminTagsPage() {
  const {
    tags,
    page,
    limit,
    loading,
    loadingCreate,
    loadingDeleteId,
    error,
    setPage,
    createTag,
    deleteTag,
  } = useAdminTags(1, 10);

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
        loading={loading}
        loadingDeleteId={loadingDeleteId}
        onPageChange={setPage}
        onDelete={deleteTag}
      />
    </div>
  );
}
