import type { CommentTreeDto } from "../../../models/comments/CommentTreeDto";

import { Badge } from "../../ui/badge/Badge";
import { Button } from "../../ui/button/Button";

type Props = {
  comment: CommentTreeDto;
  loadingCommentLikeId: number | null;
  loadingCommentUpdateId: number | null;
  loadingCommentDeleteId: number | null;
  loadingCommentFlagId: number | null;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
  onEditComment?: (commentId: number) => void;
  onDeleteComment: (commentId: number) => void;
  onFlagComment: (commentId: number) => void;
  onUnflagComment: (commentId: number) => void;
  onReply?: () => void;
  showReplyButton?: boolean;
  showRepliesCount?: boolean;
};

export function CommentActions({
  comment,
  loadingCommentLikeId,
  loadingCommentUpdateId,
  loadingCommentDeleteId,
  loadingCommentFlagId,
  onLikeComment,
  onUnlikeComment,
  onEditComment,
  onDeleteComment,
  onFlagComment,
  onUnflagComment,
  onReply,
  showReplyButton = false,
  showRepliesCount = false,
}: Props) {
  const likeLoading = loadingCommentLikeId === comment.id;
  const updateLoading = loadingCommentUpdateId === comment.id;
  const deleteLoading = loadingCommentDeleteId === comment.id;
  const flagLoading = loadingCommentFlagId === comment.id;

  const hasActionButtons =
    comment.permissions.canLike ||
    showReplyButton ||
    (comment.permissions.canUpdate && onEditComment) ||
    comment.permissions.canFlag ||
    comment.permissions.canDelete;

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {hasActionButtons && (
        <div className="flex flex-wrap items-center gap-2">
          {comment.permissions.canLike && (
            <Button
              label={comment.likedByCurrentUser ? "Unlike" : "Like"}
              loadingLabel="Loading..."
              loading={likeLoading}
              variant={comment.likedByCurrentUser ? "danger" : "primary"}
              size="sm"
              onClick={() => {
                if (comment.likedByCurrentUser) {
                  onUnlikeComment(comment.id);
                  return;
                }

                onLikeComment(comment.id);
              }}
            />
          )}

          {showReplyButton && (
            <Button
              label="Reply"
              variant="secondary"
              size="sm"
              onClick={onReply}
            />
          )}

          {comment.permissions.canUpdate && onEditComment && (
            <Button
              label="Edit"
              loadingLabel="Saving..."
              loading={updateLoading}
              variant="warning"
              size="sm"
              onClick={() => onEditComment(comment.id)}
            />
          )}

          {comment.permissions.canFlag && (
            <Button
              label={comment.isFlagged ? "Unflag" : "Flag"}
              loadingLabel="Saving..."
              loading={flagLoading}
              variant={comment.isFlagged ? "warning" : "secondary"}
              size="sm"
              onClick={() => {
                if (comment.isFlagged) {
                  onUnflagComment(comment.id);
                  return;
                }

                onFlagComment(comment.id);
              }}
            />
          )}

          {comment.permissions.canDelete && (
            <Button
              label="Delete"
              loadingLabel="Deleting..."
              loading={deleteLoading}
              variant="danger"
              size="sm"
              onClick={() => onDeleteComment(comment.id)}
            />
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="muted" className="rounded-2xl px-3 py-1.5">
          {comment.likeCount} {comment.likeCount === 1 ? "like" : "likes"}
        </Badge>

        {showRepliesCount && (
          <Badge tone="muted" className="rounded-2xl px-3 py-1.5">
            {comment.replies.length}{" "}
            {comment.replies.length === 1 ? "reply" : "replies"}
          </Badge>
        )}
      </div>
    </div>
  );
}
