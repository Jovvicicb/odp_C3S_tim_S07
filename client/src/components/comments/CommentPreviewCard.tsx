import { useState } from "react";
import type { CommentTreeDto } from "../../models/comments/CommentTreeDto";
import { CommentForm } from "./CommentForm";
import { CommentActions } from "./preview/CommentActions";
import { CommentContent } from "./preview/CommentContent";
import { CommentHeader } from "./preview/CommentHeader";
import { ReplyCard } from "./preview/ReplyCard";

type Props = {
  comment: CommentTreeDto;
  loadingCommentLikeId: number | null;
  loadingCommentCreate: boolean;
  loadingCommentUpdateId: number | null;
  loadingCommentDeleteId: number | null;
  loadingCommentFlagId: number | null;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
  onCreateReply: (parentId: number, content: string) => Promise<boolean>;
  onUpdateComment: (commentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => void;
  onFlagComment: (commentId: number) => void;
  onUnflagComment: (commentId: number) => void;
};

export function CommentPreviewCard({
  comment,
  loadingCommentLikeId,
  loadingCommentCreate,
  loadingCommentUpdateId,
  loadingCommentDeleteId,
  loadingCommentFlagId,
  onLikeComment,
  onUnlikeComment,
  onCreateReply,
  onUpdateComment,
  onDeleteComment,
  onFlagComment,
  onUnflagComment,
}: Props) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleCreateReply = async (content: string) => {
    const success = await onCreateReply(comment.id, content);

    if (success) {
      setReplyOpen(false);
    }

    return success;
  };

  const handleUpdateComment = async (content: string) => {
    const success = await onUpdateComment(comment.id, content);

    if (success) {
      setEditing(false);
    }

    return success;
  };

  return (
    <article className="rounded-3xl border border-white/8 bg-white/3 p-5 transition-all hover:border-sky-300/15 hover:bg-white/4">
      <CommentHeader comment={comment} label="Comment" />

      {editing ? (
        <div className="mt-4">
          <CommentForm
            title="Edit comment"
            description="Update your comment content."
            placeholder="Edit your comment..."
            submitLabel="Save changes"
            loading={loadingCommentUpdateId === comment.id}
            initialValue={comment.content}
            onCancel={() => setEditing(false)}
            onSubmit={handleUpdateComment}
          />
        </div>
      ) : (
        <CommentContent comment={comment} />
      )}

      {!editing && (
        <CommentActions
          comment={comment}
          loadingCommentLikeId={loadingCommentLikeId}
          loadingCommentUpdateId={loadingCommentUpdateId}
          loadingCommentDeleteId={loadingCommentDeleteId}
          loadingCommentFlagId={loadingCommentFlagId}
          onLikeComment={onLikeComment}
          onUnlikeComment={onUnlikeComment}
          onReply={() => setReplyOpen((current) => !current)}
          onEditComment={() => setEditing(true)}
          onDeleteComment={onDeleteComment}
          onFlagComment={onFlagComment}
          onUnflagComment={onUnflagComment}
          showReplyButton={comment.permissions.canReply}
          showRepliesCount
        />
      )}

      {replyOpen && !editing && (
        <div className="mt-5">
          <CommentForm
            title="Write a reply"
            description="Reply directly to this comment."
            placeholder="Write your reply..."
            submitLabel="Post reply"
            loading={loadingCommentCreate}
            compact
            onSubmit={handleCreateReply}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="mt-5 space-y-3 border-l border-sky-300/15 pl-4">
          {comment.replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              loadingCommentLikeId={loadingCommentLikeId}
              loadingCommentUpdateId={loadingCommentUpdateId}
              loadingCommentDeleteId={loadingCommentDeleteId}
              loadingCommentFlagId={loadingCommentFlagId}
              onLikeComment={onLikeComment}
              onUnlikeComment={onUnlikeComment}
              onUpdateComment={onUpdateComment}
              onDeleteComment={onDeleteComment}
              onFlagComment={onFlagComment}
              onUnflagComment={onUnflagComment}
            />
          ))}
        </div>
      )}
    </article>
  );
}
