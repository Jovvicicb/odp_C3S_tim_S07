import { useState } from "react";

import { ActionButton } from "../../../ui/ActionButton";
import { Empty, Pagination, Spinner } from "../../../ui/UI";
import { PostCard } from "../../../posts/PostCard";

import type { CommunityDto } from "../../../../models/communities/CommunityDto";
import type { PostWithDetailsDto } from "../../../../models/posts/PostWithDetailsDto";
import type { PostSortType } from "../../../../types/posts/PostSortType";
import type { CommunityViewerPermissionsDto } from "../../../../models/communities/CommunityViewerPermissionsDto";
import { SectionLabel } from "../../../ui/SectionLabel";

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

  const selectedTagName =
    selectedTagId === null
      ? "All tags"
      : (postTags.find((tag) => tag.id === selectedTagId)?.name ??
        "Selected tag");

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
        <div className="border-b border-white/8 bg-white/2 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <SectionLabel label="Community Feed" tone="sky" />

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
                Posts
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
                Browse community discussions, filter posts by tags and sort them
                by activity.
                <span className="ml-2 font-semibold text-sky-100/60">
                  {postsTotal} {postsTotal === 1 ? "post" : "posts"} available.
                </span>
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

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_260px] xl:items-start">
            <div>
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
                    Filter by tag
                  </p>

                  <p className="mt-1 text-xs text-white/25">
                    Active filter:{" "}
                    <span className="font-semibold text-sky-100/70">
                      {selectedTagId === null
                        ? selectedTagName
                        : `#${selectedTagName}`}
                    </span>
                  </p>
                </div>

                {selectedTagId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTagId(null);
                      setPostsPage(1);
                    }}
                    className="w-fit rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/45 transition-all hover:bg-white/8 hover:text-white/70"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/3 p-3">
                <div className="flex flex-wrap gap-2">
                  <TagFilterButton
                    label="All"
                    active={selectedTagId === null}
                    onClick={() => {
                      setSelectedTagId(null);
                      setPostsPage(1);
                    }}
                  />

                  {postTags.map((tag) => (
                    <TagFilterButton
                      key={tag.id}
                      label={`#${tag.name}`}
                      active={selectedTagId === tag.id}
                      onClick={() => {
                        setSelectedTagId(tag.id);
                        setPostsPage(1);
                      }}
                    />
                  ))}

                  {postTags.length === 0 && (
                    <span className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs font-medium text-white/25">
                      No tags yet
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="post-sort"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-white/30"
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

              <p className="mt-2 text-xs text-white/25">
                Sorting resets the selected tag filter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {postsLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : visiblePosts.length === 0 && !postsError ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#0b0f17]/60 p-8">
          <Empty
            message={
              selectedTagId === null
                ? "No posts found in this community."
                : "No posts found for selected tag."
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-4 shadow-xl shadow-sky-950/10">
            <Pagination
              page={postsPage}
              total={postsTotal}
              pageSize={postsLimit}
              onChange={(page) => {
                setPostsPage(page);
                setSelectedTagId(null);
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}

function TagFilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all hover:-translate-y-0.5 ${
        active
          ? "border-sky-300/25 bg-sky-400/10 text-sky-100 shadow-lg shadow-sky-500/10"
          : "border-white/10 bg-white/4 text-white/45 hover:border-white/20 hover:bg-white/6 hover:text-white/70"
      }`}
    >
      {label}
    </button>
  );
}
