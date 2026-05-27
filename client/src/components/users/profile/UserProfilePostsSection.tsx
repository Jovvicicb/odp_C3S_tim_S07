import { CountBadge } from "../../ui/CountBadge";
import { Spinner } from "../../ui/UI";
import { SectionCard } from "../../ui/SectionCard";
import { SectionEmptyState } from "../../ui/SectionEmptyState";
import { PostCard } from "../../posts/card/PostCard";

import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";

type Props = {
  posts: PostWithDetailsDto[];
  loading: boolean;
  isOwnProfile: boolean;
};

export function UserProfilePostsSection({
  posts,
  loading,
  isOwnProfile,
}: Props) {
  return (
    <SectionCard
      label="Profile posts"
      title="Posts"
      description={
        isOwnProfile
          ? "Posts you shared across communities you participate in."
          : "Posts this user shared in communities you can view."
      }
      action={
        <CountBadge count={posts.length} singular="post" plural="posts" />
      }
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : posts.length === 0 ? (
        <SectionEmptyState
          title={
            isOwnProfile ? "You have not posted yet." : "No visible posts."
          }
          description={
            isOwnProfile
              ? "Create a post in one of your communities to see it here."
              : "This user has no posts available for you to view."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} showCommunity />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
