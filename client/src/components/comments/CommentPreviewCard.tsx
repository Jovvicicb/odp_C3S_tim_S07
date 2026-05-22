import { useState } from "react";
import type { CommentTreeDto } from "../../models/comments/CommentTreeDto";
import { CommentForm } from "./CommentForm";

type Props = {
  comment: CommentTreeDto;
  loadingCommentLikeId: number | null;
  loadingCommentCreate: boolean;
  loadingCommentDeleteId: number | null;
  loadingCommentFlagId: number | null;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
  onCreateReply: (parentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => void;
  onFlagComment: (commentId: number) => void;
  onUnflagComment: (commentId: number) => void;
};

export function CommentPreviewCard({
  comment,
  loadingCommentLikeId,
  loadingCommentCreate,
  loadingCommentDeleteId,
  loadingCommentFlagId,
  onLikeComment,
  onUnlikeComment,
  onCreateReply,
  onDeleteComment,
  onFlagComment,
  onUnflagComment,
}: Props) {
  const [replyOpen, setReplyOpen] = useState(false);

  const handleCreateReply = async (content: string) => {
    const success = await onCreateReply(comment.id, content);

    if (success) {
      setReplyOpen(false);
    }

    return success;
  };

  return (
    <article className="rounded-3xl border border-white/8 bg-white/3 p-5 transition-all hover:border-sky-300/15 hover:bg-white/4">
      <CommentHeader comment={comment} label="Comment" />

      <CommentContent comment={comment} />

      <CommentActions
        comment={comment}
        loadingCommentLikeId={loadingCommentLikeId}
        loadingCommentDeleteId={loadingCommentDeleteId}
        loadingCommentFlagId={loadingCommentFlagId}
        onLikeComment={onLikeComment}
        onUnlikeComment={onUnlikeComment}
        onReply={() => setReplyOpen((current) => !current)}
        onDeleteComment={onDeleteComment}
        onFlagComment={onFlagComment}
        onUnflagComment={onUnflagComment}
        showReplyButton={comment.permissions.canReply}
        showRepliesCount
      />

      {replyOpen && (
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
              loadingCommentDeleteId={loadingCommentDeleteId}
              loadingCommentFlagId={loadingCommentFlagId}
              onLikeComment={onLikeComment}
              onUnlikeComment={onUnlikeComment}
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

function ReplyCard({
  reply,
  loadingCommentLikeId,
  loadingCommentDeleteId,
  loadingCommentFlagId,
  onLikeComment,
  onUnlikeComment,
  onDeleteComment,
  onFlagComment,
  onUnflagComment,
}: {
  reply: CommentTreeDto;
  loadingCommentLikeId: number | null;
  loadingCommentDeleteId: number | null;
  loadingCommentFlagId: number | null;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
  onDeleteComment: (commentId: number) => void;
  onFlagComment: (commentId: number) => void;
  onUnflagComment: (commentId: number) => void;
}) {
  return (
    <article className="rounded-2xl border border-white/6 bg-black/10 p-4">
      <CommentHeader comment={reply} label="Reply" />

      <CommentContent comment={reply} compact />

      <CommentActions
        comment={reply}
        loadingCommentLikeId={loadingCommentLikeId}
        loadingCommentDeleteId={loadingCommentDeleteId}
        loadingCommentFlagId={loadingCommentFlagId}
        onLikeComment={onLikeComment}
        onUnlikeComment={onUnlikeComment}
        onDeleteComment={onDeleteComment}
        onFlagComment={onFlagComment}
        onUnflagComment={onUnflagComment}
      />
    </article>
  );
}

function CommentHeader({
  comment,
  label,
}: {
  comment: CommentTreeDto;
  label: "Comment" | "Reply";
}) {
  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`rounded-xl border px-2.5 py-1 text-[11px] font-bold ${
          label === "Comment"
            ? "border-sky-300/15 bg-sky-400/10 text-sky-100"
            : "border-white/10 bg-white/5 text-white/45"
        }`}
      >
        {label} #{comment.id}
      </span>

      <span className="text-xs text-white/25">Created {createdAt}</span>

      {comment.isFlagged && (
        <span className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-200">
          Flagged
        </span>
      )}

      {comment.isDeleted && (
        <span className="rounded-xl border border-red-400/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-200">
          Deleted
        </span>
      )}
    </div>
  );
}

function CommentContent({
  comment,
  compact = false,
}: {
  comment: CommentTreeDto;
  compact?: boolean;
}) {
  if (comment.isDeleted) {
    return (
      <p className="mt-3 rounded-2xl border border-white/6 bg-white/2 px-4 py-3 text-sm italic text-white/30">
        This comment was deleted.
      </p>
    );
  }

  return (
    <p
      className={`mt-3 whitespace-pre-wrap text-sm leading-7 ${
        compact ? "text-white/55" : "text-white/65"
      }`}
    >
      {comment.content}
    </p>
  );
}

function CommentActions({
  comment,
  loadingCommentLikeId,
  loadingCommentDeleteId,
  loadingCommentFlagId,
  onLikeComment,
  onUnlikeComment,
  onDeleteComment,
  onFlagComment,
  onUnflagComment,
  onReply,
  showReplyButton = false,
  showRepliesCount = false,
}: {
  comment: CommentTreeDto;
  loadingCommentLikeId: number | null;
  loadingCommentDeleteId: number | null;
  loadingCommentFlagId: number | null;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
  onDeleteComment: (commentId: number) => void;
  onFlagComment: (commentId: number) => void;
  onUnflagComment: (commentId: number) => void;
  onReply?: () => void;
  showReplyButton?: boolean;
  showRepliesCount?: boolean;
}) {
  const likeLoading = loadingCommentLikeId === comment.id;
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

function CommentActionButton({
  children,
  tone,
  disabled = false,
  onClick,
}: {
  children: string;
  tone: "primary" | "neutral" | "warning" | "danger";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const toneClass: Record<typeof tone, string> = {
    primary: "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15",
    neutral:
      "border-white/10 bg-white/5 text-white/60 hover:border-sky-300/20 hover:bg-sky-400/10 hover:text-sky-100",
    warning:
      "border-amber-400/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15",
    danger: "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${toneClass[tone]}`}
    >
      {children}
    </button>
  );
}
