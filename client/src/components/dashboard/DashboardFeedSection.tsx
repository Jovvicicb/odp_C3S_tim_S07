import { CountBadge } from "../ui/CountBadge";
import { Pagination, Spinner } from "../ui/UI";
import { SectionCard } from "../ui/SectionCard";
import { SectionEmptyState } from "../ui/SectionEmptyState";
import { PostCard } from "../posts/card/PostCard";

import type { PostWithDetailsDto } from "../../models/posts/PostWithDetailsDto";

type Props = {
  posts: PostWithDetailsDto[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function DashboardFeedSection({
  posts,
  loading,
  page,
  limit,
  total,
  onPageChange,
}: Props) {
  return (
    <SectionCard
      label="Personalized feed"
      title="Your feed"
      description="See recent posts from communities you joined and from users you follow, while community visibility rules are always respected."
      action={<CountBadge count={total} singular="post" plural="posts" />}
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : posts.length === 0 ? (
        <SectionEmptyState
          title="Your feed is empty."
          description="Join communities or follow users to personalize your dashboard feed."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showCommunity />
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            pageSize={limit}
            onChange={onPageChange}
          />
        </>
      )}
    </SectionCard>
  );
}
