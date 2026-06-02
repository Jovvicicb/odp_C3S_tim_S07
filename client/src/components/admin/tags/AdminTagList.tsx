import { Pagination, Spinner } from "../../ui/UI";
import { SectionEmptyState } from "../../ui/SectionEmptyState";

import { AdminTagCard } from "./AdminTagCard";

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
      <SectionEmptyState
        title="No tags found."
        description="Create the first global tag above and it will appear here."
      />
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
