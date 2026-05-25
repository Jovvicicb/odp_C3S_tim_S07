import { useState } from "react";

import type { CommentTreeDto } from "../../../models/comments/CommentTreeDto";

import { CommentForm } from "../form/CommentForm";
import { CommentActions } from "../shared/CommentActions";
import { CommentContent } from "../shared/CommentContent";
import { CommentHeader } from "../shared/CommentHeader";
import { ReplyCard } from "./ReplyCard";

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
  const [repliesOpen, setRepliesOpen] = useState(false);

  const repliesCount = comment.replies.length;
  const hasReplies = repliesCount > 0;

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

      {hasReplies && !editing && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setRepliesOpen((current) => !current)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold text-white/55 transition-all hover:border-sky-300/20 hover:bg-sky-400/10 hover:text-sky-100"
          >
            <span>
              {repliesOpen
                ? "Hide replies"
                : `Show ${repliesCount} ${
                    repliesCount === 1 ? "reply" : "replies"
                  }`}
            </span>

            <span>{repliesOpen ? "↑" : "↓"}</span>
          </button>

          {repliesOpen && (
            <div className="mt-4 space-y-3 border-l border-sky-300/15 pl-4">
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
        </div>
      )}
    </article>
  );
}
