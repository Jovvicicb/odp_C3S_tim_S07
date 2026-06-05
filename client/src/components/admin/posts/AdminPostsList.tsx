import { Pagination } from "../../ui/pagination/Pagination";
import { Spinner } from "../../ui/spinner/Spinner";
import { SectionEmptyState } from "../../ui/empty/SectionEmptyState";
import { PostCard } from "../../posts/card/PostCard";

import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";

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

export function AdminPostsList({
  posts,
  page,
  limit,
  total,
  loading,
  loadingPostId,
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

  if (posts.length === 0) {
    return (
      <SectionEmptyState
        title="No posts found."
        description="Posts created across communities will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showCommunity
            showDeleteAction
            deleteLoading={loadingPostId === post.id}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="border-t border-white/8 pt-5">
        <Pagination
          page={page}
          total={total}
          pageSize={limit}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}
