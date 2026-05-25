import type { CommentTreeDto } from "../../../models/comments/CommentTreeDto";

type Props = {
  comment: CommentTreeDto;
  compact?: boolean;
};

export function CommentContent({ comment, compact = false }: Props) {
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
