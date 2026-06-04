import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";

import { CountBadge } from "../../ui/CountBadge";
import { SectionCard } from "../../ui/SectionCard";
import { AdminPostsList } from "./AdminPostsList";

type Props = {
  posts: PostWithDetailsDto[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  loadingPostId: number | null;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
};

export function AdminPostsSection({
  posts,
  page,
  limit,
  total,
  loading,
  loadingPostId,
  onPageChange,
  onDelete,
}: Props) {
  return (
    <SectionCard
      label="Posts"
      title="All system posts"
      description="Review posts created across all communities and remove content that violates community rules."
      action={<CountBadge count={total} singular="post" plural="posts" />}
    >
      <AdminPostsList
        posts={posts}
        page={page}
        limit={limit}
        total={total}
        loading={loading}
        loadingPostId={loadingPostId}
        onPageChange={onPageChange}
        onDelete={onDelete}
      />
    </SectionCard>
  );
}
