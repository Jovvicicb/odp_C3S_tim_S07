import type { PaginatedListDto } from "../../../models/common/PaginatedListDto";
import type { TagDto } from "../../../models/tags/TagDto";

import { CountBadge } from "../../ui/CountBadge";
import { SectionCard } from "../../ui/SectionCard";
import { AdminTagList } from "./AdminTagList";

type Props = {
  tags: PaginatedListDto<TagDto>;
  page: number;
  limit: number;
  loading: boolean;
  loadingDeleteId: number | null;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
};

export function AdminTagsSection({
  tags,
  page,
  limit,
  loading,
  loadingDeleteId,
  onPageChange,
  onDelete,
}: Props) {
  return (
    <SectionCard
      label="Tag library"
      title="Existing global tags"
      description="Manage the global list of reusable tags that can be attached to posts across communities."
      action={<CountBadge count={tags.total} singular="tag" plural="tags" />}
    >
      <AdminTagList
        tags={tags}
        page={page}
        limit={limit}
        loading={loading}
        loadingDeleteId={loadingDeleteId}
        onPageChange={onPageChange}
        onDelete={onDelete}
      />
    </SectionCard>
  );
}
