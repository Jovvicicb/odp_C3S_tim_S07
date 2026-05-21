import { useParams } from "react-router-dom";

import {
  Empty,
  ErrorBox,
  PageHeader,
  Pagination,
  Spinner,
} from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/ActionButton";
import { ImageHelper } from "../../helpers/images/ImageHelper";

import { usePostDetails } from "../../hooks/posts/details/usePostDetails";

export default function PostDetailsPage() {
  const { id } = useParams();

  const postId = Number(id);
  const parsedPostId = Number.isNaN(postId) ? null : postId;

  const {
    postDetails,
    loading,
    error,
    commentsPage,
    commentsLimit,
    commentsSort,
    setCommentsPage,
    setCommentsSort,
  } = usePostDetails(parsedPostId, 1, 10, "newest");

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!postDetails) {
    return <Empty message="Post not found." />;
  }

  const imageUrl = ImageHelper.getImageUrl(postDetails.mediaUrl);
  const createdAt = new Date(postDetails.createdAt).toLocaleDateString();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Post Details"
        title={postDetails.title}
        action={<ActionButton variant="back" label="Back" />}
      />

      {error && <ErrorBox message={error} />}

      <article className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
        {imageUrl && (
          <div className="max-h-105 overflow-hidden border-b border-white/8">
            <img
              src={imageUrl}
              alt={postDetails.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/35">
                <span>Post #{postDetails.id}</span>
                <span>·</span>
                <span>Created {createdAt}</span>
                <span>·</span>
                <span className="capitalize">{postDetails.community.type}</span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
                {postDetails.title}
              </h1>

              <p className="mt-3 text-sm text-white/40">
                By{" "}
                <span className="font-semibold text-sky-200">
                  {postDetails.author?.username ?? "Unknown user"}
                </span>{" "}
                in{" "}
                <span className="font-semibold text-white/70">
                  {postDetails.community.name}
                </span>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <span className="rounded-2xl border border-sky-300/15 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-100">
                {postDetails.likeCount} likes
              </span>

              <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50">
                {postDetails.commentCount} comments
              </span>
            </div>
          </div>

          {postDetails.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {postDetails.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-xl border border-sky-300/15 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-100"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-3xl border border-white/6 bg-white/3 p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-white/60">
              {postDetails.content}
            </p>
          </div>
        </div>
      </article>

      <section className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Comments
            </h2>

            <p className="mt-2 text-sm text-white/35">
              {postDetails.comments.total} root comments ·{" "}
              {postDetails.commentCount} total comments
            </p>
          </div>

          <select
            value={commentsSort}
            onChange={(e) => {
              setCommentsPage(1);
              setCommentsSort(e.target.value as "newest" | "popular");
            }}
            className="w-fit rounded-2xl border border-white/10 bg-[#07111f] px-4 py-2 text-sm font-semibold text-white/80 outline-none transition-all hover:border-sky-300/30 focus:border-sky-300/40"
          >
            <option value="newest" className="bg-[#07111f] text-white">
              Newest
            </option>

            <option value="popular" className="bg-[#07111f] text-white">
              Popular
            </option>
          </select>
        </div>

        {postDetails.comments.items.length === 0 ? (
          <div className="mt-6">
            <Empty message="No comments yet." />
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              {postDetails.comments.items.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-3xl border border-white/8 bg-white/3 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/30">
                    <span>Comment #{comment.id}</span>
                    <span>·</span>
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>

                    {comment.isFlagged && (
                      <>
                        <span>·</span>
                        <span className="font-semibold text-amber-300">
                          Flagged
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/60">
                    {comment.content}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/35">
                    <span>{comment.likeCount} likes</span>
                    <span>·</span>
                    <span>{comment.replies.length} replies</span>
                  </div>

                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3 border-l border-white/10 pl-4">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="rounded-2xl border border-white/6 bg-black/10 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-xs text-white/30">
                            <span>Reply #{reply.id}</span>
                            <span>·</span>
                            <span>
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>

                            {reply.isFlagged && (
                              <>
                                <span>·</span>
                                <span className="font-semibold text-amber-300">
                                  Flagged
                                </span>
                              </>
                            )}
                          </div>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-white/55">
                            {reply.content}
                          </p>

                          <p className="mt-3 text-xs text-white/35">
                            {reply.likeCount} likes
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Pagination
                page={commentsPage}
                total={postDetails.comments.total}
                pageSize={commentsLimit}
                onChange={setCommentsPage}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
