import { ErrorBox, PageHeader } from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/button/ActionButton";
import { AdminTagForm } from "../../components/tags/admin/AdminTagForm";
import { AdminTagList } from "../../components/tags/admin/AdminTagList";
import { useAdminTags } from "../../hooks/tags/useAdminTags";

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
        eyebrow="Admin Panel"
        title="Global Tags"
        action={<ActionButton variant="back" label="Back" />}
      />

      {error && <ErrorBox message={error} />}

      <AdminTagForm loading={loadingCreate} onSubmit={createTag} />

      <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
        <div className="border-b border-white/8 bg-white/2 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/50">
                Tag Library
              </p>

              <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
                Existing global tags
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
                Manage the global list of tags that can be attached to posts
                across communities.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-sky-300/15 bg-sky-400/10 px-4 py-3 text-right">
              <p className="text-2xl font-bold text-sky-100">{tags.total}</p>
              <p className="text-xs font-medium text-sky-100/45">total tags</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AdminTagList
            tags={tags}
            page={page}
            limit={limit}
            loading={loading}
            loadingDeleteId={loadingDeleteId}
            onPageChange={setPage}
            onDelete={deleteTag}
          />
        </div>
      </section>
    </div>
  );
}
