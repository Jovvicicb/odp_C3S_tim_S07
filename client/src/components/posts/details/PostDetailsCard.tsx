import { ImageHelper } from "../../../helpers/images/ImageHelper";
import type { PostDetailsDto } from "../../../models/posts/PostDetailsDto";
import { PostStatsActions } from "./PostStatsActions";

import { MarkdownContent } from "../../markdown/MarkdownContent";

type Props = {
  post: PostDetailsDto;
  loadingPostLike: boolean;
  loadingPostDelete: boolean;
  onLikePost: (postId: number) => void;
  onUnlikePost: (postId: number) => void;
  onEditPost: (postId: number) => void;
  onDeletePost: (postId: number) => void;
};

export function PostDetailsCard({
  post,
  loadingPostLike,
  loadingPostDelete,
  onLikePost,
  onUnlikePost,
  onEditPost,
  onDeletePost,
}: Props) {
  const imageUrl = ImageHelper.getImageUrl(post.mediaUrl);
  const createdAt = new Date(post.createdAt).toLocaleDateString();

  return (
    <article className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      {imageUrl && (
        <div className="max-h-105 overflow-hidden border-b border-white/8 bg-black/20">
          <img
            src={imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <PostMetaBadge label={`Post #${post.id}`} tone="muted" />
              <PostMetaBadge label={`Created ${createdAt}`} tone="muted" />
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-white/35">By</span>

              <span className="rounded-xl border border-sky-300/15 bg-sky-400/10 px-2.5 py-1 text-xs font-semibold text-sky-100">
                {post.author?.username ?? "Unavailable  user"}
              </span>

              <span className="text-white/35">in</span>

              <span className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/70">
                {post.community.name}
              </span>
            </div>
          </div>

          <PostStatsActions
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            canLikePost={post.permissions.canLikePost}
            canEditPost={post.permissions.canEditPost}
            canDeletePost={post.permissions.canDeletePost}
            likedByCurrentUser={post.likedByCurrentUser}
            loadingPostLike={loadingPostLike}
            loadingPostDelete={loadingPostDelete}
            onLike={() => onLikePost(post.id)}
            onUnlike={() => onUnlikePost(post.id)}
            onEdit={() => onEditPost(post.id)}
            onDelete={() => onDeletePost(post.id)}
          />
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-white/6 pt-5">
            {post.tags.map((tag) => (
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
          <MarkdownContent content={post.content} />
        </div>
      </div>
    </article>
  );
}

function PostMetaBadge({
  label,
  tone,
}: {
  label: string;
  tone: "muted" | "type";
}) {
  return (
    <span
      className={`rounded-xl border px-2.5 py-1 text-[11px] font-semibold capitalize ${
        tone === "type"
          ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
          : "border-white/10 bg-white/5 text-white/35"
      }`}
    >
      {label}
    </span>
  );
}
