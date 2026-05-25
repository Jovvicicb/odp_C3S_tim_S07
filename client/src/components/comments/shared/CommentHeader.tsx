import type { CommentTreeDto } from "../../../models/comments/CommentTreeDto";

import { Badge } from "../../ui/Badge";

type Props = {
  comment: CommentTreeDto;
  label: "Comment" | "Reply";
};

export function CommentHeader({ comment, label }: Props) {
  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/35">
      <span className="font-semibold text-sky-100/65">{label}</span>

      <span className="text-white/15">•</span>

      <span>
        By{" "}
        <span className="font-semibold text-sky-100/65">
          {comment.authorUsername ?? "Unavailable user"}
        </span>
      </span>

      <span className="text-white/15">•</span>

      <span>Created {createdAt}</span>

      {comment.isFlagged && (
        <>
          <span className="text-white/15">•</span>

          <Badge tone="amber" className="text-[11px] font-bold">
            Flagged
          </Badge>
        </>
      )}

      {comment.isDeleted && (
        <>
          <span className="text-white/15">•</span>

          <Badge tone="red" className="text-[11px] font-bold">
            Deleted
          </Badge>
        </>
      )}
    </div>
  );
}
