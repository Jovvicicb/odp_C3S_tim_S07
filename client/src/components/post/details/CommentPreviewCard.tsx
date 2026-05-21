import type { CommentTreeDto } from "../../../models/comment/CommentTreeDto";

type Props = {
  comment: CommentTreeDto;
  loadingCommentLikeId: number | null;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
};

export function CommentPreviewCard({
  comment,
  loadingCommentLikeId,
  onLikeComment,
  onUnlikeComment,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/3 p-5">
      <CommentHeader comment={comment} label="Comment" />

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/60">
        {comment.content}
      </p>

      <CommentActions
        comment={comment}
        loadingCommentLikeId={loadingCommentLikeId}
        onLikeComment={onLikeComment}
        onUnlikeComment={onUnlikeComment}
        showRepliesCount
      />

      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-3 border-l border-white/10 pl-4">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-2xl border border-white/6 bg-black/10 p-4"
            >
              <CommentHeader comment={reply} label="Reply" />

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-white/55">
                {reply.content}
              </p>

              <CommentActions
                comment={reply}
                loadingCommentLikeId={loadingCommentLikeId}
                onLikeComment={onLikeComment}
                onUnlikeComment={onUnlikeComment}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentHeader({
  comment,
  label,
}: {
  comment: CommentTreeDto;
  label: "Comment" | "Reply";
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-white/30">
      <span>
        {label} #{comment.id}
      </span>

      <span>·</span>

      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>

      {comment.isFlagged && (
        <>
          <span>·</span>
          <span className="font-semibold text-amber-300">Flagged</span>
        </>
      )}
    </div>
  );
}

function CommentActions({
  comment,
  loadingCommentLikeId,
  onLikeComment,
  onUnlikeComment,
  showRepliesCount = false,
}: {
  comment: CommentTreeDto;
  loadingCommentLikeId: number | null;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
  showRepliesCount?: boolean;
}) {
  const likeLoading = loadingCommentLikeId === comment.id;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/35">
      {comment.permissions.canLike && (
        <button
          type="button"
          disabled={likeLoading}
          onClick={() => {
            if (comment.likedByCurrentUser) {
              onUnlikeComment(comment.id);
              return;
            }

            onLikeComment(comment.id);
          }}
          className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
            comment.likedByCurrentUser
              ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
              : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15"
          }`}
        >
          {likeLoading
            ? "Loading..."
            : comment.likedByCurrentUser
              ? "Unlike"
              : "Like"}
        </button>
      )}

      <span>{comment.likeCount} likes</span>

      {showRepliesCount && (
        <>
          <span>·</span>
          <span>{comment.replies.length} replies</span>
        </>
      )}
    </div>
  );
}
