import { Badge } from "../../../ui/Badge";
import { Button } from "../../../ui/button/Button";

type Props = {
  likeCount: number;
  commentCount: number;
  canLikePost: boolean;
  canEditPost: boolean;
  canDeletePost: boolean;
  likedByCurrentUser: boolean;
  loadingPostLike: boolean;
  loadingPostDelete: boolean;
  onLike: () => void;
  onUnlike: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function PostStatsActions({
  likeCount,
  commentCount,
  canLikePost,
  canEditPost,
  canDeletePost,
  likedByCurrentUser,
  loadingPostLike,
  loadingPostDelete,
  onLike,
  onUnlike,
  onEdit,
  onDelete,
}: Props) {
  const hasManagementActions = canEditPost || canDeletePost;

  return (
    <div className="flex flex-col gap-3 lg:items-end">
      <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
        {canLikePost && (
          <Button
            label={likedByCurrentUser ? "Unlike" : "Like"}
            loadingLabel="Loading..."
            loading={loadingPostLike}
            variant={likedByCurrentUser ? "danger" : "primary"}
            onClick={likedByCurrentUser ? onUnlike : onLike}
          />
        )}

        {hasManagementActions && (
          <div className="flex flex-wrap gap-2 border-l border-white/10 pl-2">
            {canEditPost && (
              <Button label="Edit" variant="warning" onClick={onEdit} />
            )}

            {canDeletePost && (
              <Button
                label="Delete"
                loadingLabel="Deleting..."
                loading={loadingPostDelete}
                variant="danger"
                onClick={onDelete}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
        <Badge tone="sky" className="rounded-2xl px-3 py-1.5">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </Badge>

        <Badge tone="muted" className="rounded-2xl px-3 py-1.5">
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </Badge>
      </div>
    </div>
  );
}
