import { useState } from "react";

import { ActionButton } from "../../../ui/button/ActionButton";
import { CountBadge } from "../../../ui/badge/CountBadge";
import { Pagination } from "../../../ui/pagination/Pagination";
import { Spinner } from "../../../ui/spinner/Spinner";
import { SectionCard } from "../../../ui/card/SectionCard";
import { SectionEmptyState } from "../../../ui/empty/SectionEmptyState";
import { PostCard } from "../../../posts/card/PostCard";

import type { CommunityDto } from "../../../../models/communities/CommunityDto";
import type { CommunityViewerPermissionsDto } from "../../../../models/communities/CommunityViewerPermissionsDto";
import type { PostWithDetailsDto } from "../../../../models/posts/PostWithDetailsDto";
import type { PostSortType } from "../../../../types/posts/PostSortType";

import { CommunityPostsToolbar } from "./CommunityPostsToolbar";

type Props = {
  community: CommunityDto;
  permissions: CommunityViewerPermissionsDto;
  posts: PostWithDetailsDto[];
  postsLoading: boolean;
  postsError: string;
  postsPage: number;
  postsLimit: number;
  postsTotal: number;
  postsSort: PostSortType;
  setPostsPage: (page: number) => void;
  setPostsSort: (sort: PostSortType) => void;
};

export function CommunityPostsSection({
  community,
  permissions,
  posts,
  postsLoading,
  postsError,
  postsPage,
  postsLimit,
  postsTotal,
  postsSort,
  setPostsPage,
  setPostsSort,
}: Props) {
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const postTags = Array.from(
    new Map(
      posts.flatMap((post) => post.tags).map((tag) => [tag.id, tag]),
    ).values(),
  );

  const visiblePosts =
    selectedTagId === null
      ? posts
      : posts.filter((post) =>
          post.tags.some((tag) => tag.id === selectedTagId),
        );

  const selectedTagName =
    selectedTagId === null
      ? "All tags"
      : (postTags.find((tag) => tag.id === selectedTagId)?.name ??
        "Selected tag");

  const handleTagChange = (tagId: number | null) => {
    setSelectedTagId(tagId);
    setPostsPage(1);
  };

  const handleSortChange = (sort: PostSortType) => {
    setPostsSort(sort);
    setPostsPage(1);
    setSelectedTagId(null);
  };

  const handlePageChange = (page: number) => {
    setPostsPage(page);
    setSelectedTagId(null);
  };

  return (
    <section className="space-y-5">
      <SectionCard
        label="Community feed"
        title="Posts"
        description="Browse community discussions, filter posts by tags and sort them by activity."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <CountBadge count={postsTotal} singular="post" plural="posts" />

            {permissions.canCreatePost && (
              <ActionButton
                variant="create"
                label="Create post"
                to={`/communities/${community.id}/posts/create`}
                size="md"
              />
            )}
          </div>
        }
      >
        <CommunityPostsToolbar
          tags={postTags}
          selectedTagId={selectedTagId}
          selectedTagName={selectedTagName}
          sort={postsSort}
          onTagChange={handleTagChange}
          onSortChange={handleSortChange}
        />
      </SectionCard>
      {postsLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : visiblePosts.length === 0 && !postsError ? (
        <SectionEmptyState
          title={
            selectedTagId === null ? "No posts yet." : "No posts for this tag."
          }
          description={
            selectedTagId === null
              ? permissions.canCreatePost
                ? "Be the first to start a discussion in this community."
                : "Posts will appear here when community members create them."
              : "Try selecting another tag or clearing the current filter."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            page={postsPage}
            total={postsTotal}
            pageSize={postsLimit}
            onChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
