import type { CommentTreeDto } from "../../../models/comments/CommentTreeDto";

type Props = {
  comment: CommentTreeDto;
  label: "Comment" | "Reply";
};

export function CommentHeader({ comment, label }: Props) {
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
