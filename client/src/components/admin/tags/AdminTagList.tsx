import { Empty, Pagination, Spinner } from "../../ui/UI";
import type { PaginatedListDto } from "../../../models/common/PaginatedListDto";
import type { TagDto } from "../../../models/tags/TagDto";

type Props = {
  tags: PaginatedListDto<TagDto>;
  page: number;
  limit: number;
  loading: boolean;
  loadingDeleteId: number | null;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
};

export function AdminTagList({
  tags,
  page,
  limit,
  loading,
  loadingDeleteId,
  onPageChange,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={24} />
      </div>
    );
  }

  if (tags.items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/2 p-10">
        <Empty message="No tags found. Create the first global tag above." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tags.items.map((tag) => (
          <AdminTagCard
            key={tag.id}
            tag={tag}
            deleting={loadingDeleteId === tag.id}
            onDelete={() => onDelete(tag.id)}
          />
        ))}
      </div>

      <div className="border-t border-white/8 pt-5">
        <Pagination
          page={page}
          total={tags.total}
          pageSize={limit}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}

function AdminTagCard({
  tag,
  deleting,
  onDelete,
}: {
  tag: TagDto;
  deleting: boolean;
  onDelete: () => void;
}) {
  const createdAt = new Date(tag.createdAt).toLocaleDateString();

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-4 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-white/5">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-400/5 blur-3xl transition-all group-hover:bg-sky-400/10" />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 text-base font-bold text-white">
              #{tag.name}
            </p>

            <p className="mt-1 text-xs text-white/25">Created {createdAt}</p>
          </div>

          <span className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/35">
            ID {tag.id}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-white/6 pt-4">
          <span className="text-xs font-medium text-white/30">Global tag</span>

          <button
            type="button"
            disabled={deleting}
            onClick={onDelete}
            className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
