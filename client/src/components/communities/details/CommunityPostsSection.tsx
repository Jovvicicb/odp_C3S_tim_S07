import { useState } from "react";

import { ActionButton } from "../../ui/ActionButton";
import { Empty, Pagination, Spinner } from "../../ui/UI";
import { PostCard } from "../../posts/PostCard";

import type { CommunityDto } from "../../../models/communities/CommunityDto";
import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";
import type { PostSortType } from "../../../types/posts/PostSortType";
import type { CommunityViewerPermissionsDto } from "../../../models/communities/CommunityViewerPermissionsDto";

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

  const canCreatePost = permissions.canCreatePost;

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

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
        <div className="border-b border-white/6 px-6 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Posts
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/40">
                Browse discussions, filter by tags and sort posts by activity.
              </p>
            </div>

            {canCreatePost && (
              <ActionButton
                variant="create"
                label="Create post"
                to={`/communities/${community.id}/posts/create`}
                size="md"
              />
            )}
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/25">
                Filter by tag
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTagId(null);
                    setPostsPage(1);
                  }}
                  className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition-all ${
                    selectedTagId === null
                      ? "border-sky-300/30 bg-sky-400/10 text-sky-100 shadow-lg shadow-sky-500/10"
                      : "border-white/10 bg-white/4 text-white/45 hover:border-white/20 hover:bg-white/6 hover:text-white/70"
                  }`}
                >
                  All
                </button>

                {postTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedTagId(tag.id);
                      setPostsPage(1);
                    }}
                    className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition-all ${
                      selectedTagId === tag.id
                        ? "border-sky-300/30 bg-sky-400/10 text-sky-100 shadow-lg shadow-sky-500/10"
                        : "border-white/10 bg-white/4 text-white/45 hover:border-white/20 hover:bg-white/6 hover:text-white/70"
                    }`}
                  >
                    #{tag.name}
                  </button>
                ))}

                {postTags.length === 0 && (
                  <span className="rounded-2xl border border-white/8 bg-white/3 px-4 py-2 text-xs font-medium text-white/25">
                    No tags yet
                  </span>
                )}
              </div>
            </div>

            <div className="w-full xl:w-64">
              <label
                htmlFor="post-sort"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-white/25"
              >
                Sort posts
              </label>

              <select
                id="post-sort"
                name="post-sort"
                value={postsSort}
                onChange={(e) => {
                  setPostsSort(e.target.value as PostSortType);
                  setPostsPage(1);
                  setSelectedTagId(null);
                }}
                className="w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm font-semibold text-white/75 outline-none transition-all hover:border-sky-300/30 focus:border-sky-300/40"
              >
                <option value="newest" className="bg-[#07111f] text-white">
                  Newest
                </option>

                <option value="popular" className="bg-[#07111f] text-white">
                  Most popular
                </option>

                <option
                  value="mostCommented"
                  className="bg-[#07111f] text-white"
                >
                  Most commented
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {postsLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : visiblePosts.length === 0 && !postsError ? (
        <Empty
          message={
            selectedTagId === null
              ? "No posts found in this community."
              : "No posts found for selected tag."
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
            onChange={(page) => {
              setPostsPage(page);
              setSelectedTagId(null);
            }}
          />
        </>
      )}
    </div>
  );
}
