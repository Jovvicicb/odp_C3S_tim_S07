import { ImageHelper } from "../../../helpers/images/ImageHelper";
import type { PostDetailsDto } from "../../../models/post/PostDetailsDto";
import { PostStatsActions } from "./PostStatsActions";

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
        <div className="max-h-105 overflow-hidden border-b border-white/8">
          <img
            src={imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/35">
              <span>Post #{post.id}</span>
              <span>·</span>
              <span>Created {createdAt}</span>
              <span>·</span>
              <span className="capitalize">{post.community.type}</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
              {post.title}
            </h1>

            <p className="mt-3 text-sm text-white/40">
              By{" "}
              <span className="font-semibold text-sky-200">
                {post.author?.username ?? "Unknown user"}
              </span>{" "}
              in{" "}
              <span className="font-semibold text-white/70">
                {post.community.name}
              </span>
            </p>
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
          <div className="flex flex-wrap gap-2">
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
          <p className="whitespace-pre-wrap text-sm leading-7 text-white/60">
            {post.content}
          </p>
        </div>
      </div>
    </article>
  );
}
