import type { CommentTreeDto } from "../../../models/comments/CommentTreeDto";
import { CommentActionButton } from "./CommentActionButton";

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

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {comment.permissions.canLike && (
          <CommentActionButton
            disabled={likeLoading}
            tone={comment.likedByCurrentUser ? "danger" : "primary"}
            onClick={() => {
              if (comment.likedByCurrentUser) {
                onUnlikeComment(comment.id);
                return;
              }

              onLikeComment(comment.id);
            }}
          >
            {likeLoading
              ? "Loading..."
              : comment.likedByCurrentUser
                ? "Unlike"
                : "Like"}
          </CommentActionButton>
        )}

        {showReplyButton && (
          <CommentActionButton tone="neutral" onClick={onReply}>
            Reply
          </CommentActionButton>
        )}

        {comment.permissions.canUpdate && onEditComment && (
          <CommentActionButton
            disabled={updateLoading}
            tone="warning"
            onClick={() => onEditComment(comment.id)}
          >
            {updateLoading ? "Saving..." : "Edit"}
          </CommentActionButton>
        )}

        {comment.permissions.canFlag && (
          <CommentActionButton
            disabled={flagLoading}
            tone={comment.isFlagged ? "warning" : "neutral"}
            onClick={() => {
              if (comment.isFlagged) {
                onUnflagComment(comment.id);
                return;
              }

              onFlagComment(comment.id);
            }}
          >
            {flagLoading ? "Saving..." : comment.isFlagged ? "Unflag" : "Flag"}
          </CommentActionButton>
        )}

        {comment.permissions.canDelete && (
          <CommentActionButton
            disabled={deleteLoading}
            tone="danger"
            onClick={() => onDeleteComment(comment.id)}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </CommentActionButton>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/30">
        <span>{comment.likeCount} likes</span>

        {showRepliesCount && (
          <>
            <span>·</span>
            <span>{comment.replies.length} replies</span>
          </>
        )}
      </div>
    </div>
  );
}
