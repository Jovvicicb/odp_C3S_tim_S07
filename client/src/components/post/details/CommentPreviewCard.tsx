import type { CommentTreeDto } from "../../../models/comment/CommentTreeDto";

type Props = {
  comment: CommentTreeDto;
};

export function CommentPreviewCard({ comment }: Props) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/3 p-5">
      <CommentHeader comment={comment} label="Comment" />

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/60">
        {comment.content}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/35">
        <span>{comment.likeCount} likes</span>
        <span>·</span>
        <span>{comment.replies.length} replies</span>
      </div>

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

              <p className="mt-3 text-xs text-white/35">
                {reply.likeCount} likes
              </p>
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
