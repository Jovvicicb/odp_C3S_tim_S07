import { ImageHelper } from "../../../../helpers/images/ImageHelper";
import type { PostDetailsDto } from "../../../../models/posts/PostDetailsDto";
import type { PostTagDto } from "../../../../models/tags/PostTagDto";

import { MarkdownContent } from "../../../markdown/MarkdownContent";
import { PostStatsActions } from "../stats/PostStatsActions";
import { PostTagsPanel } from "../tags/PostTagsPanel";

type Props = {
  post: PostDetailsDto;
  loadingPostLike: boolean;
  loadingPostDelete: boolean;
  loadingPostTagAddId: number | null;
  loadingPostTagRemoveId: number | null;
  onLikePost: (postId: number) => void;
  onUnlikePost: (postId: number) => void;
  onEditPost: (postId: number) => void;
  onDeletePost: (postId: number) => void;
  onAddPostTag: (postId: number, tag: PostTagDto) => Promise<boolean>;
  onRemovePostTag: (postId: number, tagId: number) => Promise<boolean>;
};

export function PostDetailsCard({
  post,
  loadingPostLike,
  loadingPostDelete,
  loadingPostTagAddId,
  loadingPostTagRemoveId,
  onLikePost,
  onUnlikePost,
  onEditPost,
  onDeletePost,
  onAddPostTag,
  onRemovePostTag,
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
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {post.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/35">
              <span>
                By{" "}
                <span className="font-semibold text-sky-100/65">
                  {post.author?.username ?? "Unavailable user"}
                </span>
              </span>

              <span className="text-white/15">•</span>

              <span>
                in{" "}
                <span className="font-semibold text-sky-100/65">
                  {post.community.name}
                </span>
              </span>

              <span className="text-white/15">•</span>

              <span>Created {createdAt}</span>
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

        <PostTagsPanel
          postId={post.id}
          tags={post.tags}
          canManageTags={post.permissions.canManageTags}
          loadingPostTagAddId={loadingPostTagAddId}
          loadingPostTagRemoveId={loadingPostTagRemoveId}
          onAddTag={onAddPostTag}
          onRemoveTag={onRemovePostTag}
        />

        <div className="rounded-3xl border border-white/6 bg-white/3 p-5">
          <MarkdownContent content={post.content} />
        </div>
      </div>
    </article>
  );
}
