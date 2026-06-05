import { useNavigate } from "react-router-dom";

import { renderContentWithMentions } from "../../../helpers/comments/CommentMentionHelper";
import type { UserProfileCommentDto } from "../../../models/comments/UserProfileCommentDto";

import { Badge } from "../../ui/badge/Badge";

type Props = {
  comment: UserProfileCommentDto;
};

export function UserProfileCommentCard({ comment }: Props) {
  const navigate = useNavigate();

  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  return (
    <article
      onClick={() => navigate(`/posts/${comment.postId}`)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-5 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-white/4"
    >
      <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-sky-400/5 blur-3xl transition-all group-hover:bg-sky-400/10" />

      <div className="relative z-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="sky">Comment</Badge>

              {comment.parentId !== null && <Badge tone="muted">Reply</Badge>}

              {comment.isFlagged && <Badge tone="amber">Flagged</Badge>}

              {comment.isDeleted && <Badge tone="red">Deleted</Badge>}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/35">
              <span>
                On{" "}
                <span className="font-semibold text-sky-100/65">
                  {comment.postTitle ?? `Post #${comment.postId}`}
                </span>
              </span>

              <span className="text-white/15">•</span>

              <span>
                in{" "}
                <span className="font-semibold text-sky-100/65">
                  {comment.communityName ?? `Community #${comment.communityId}`}
                </span>
              </span>

              <span className="text-white/15">•</span>

              <span>Created {createdAt}</span>
            </div>
          </div>

          <span className="shrink-0 text-xs font-bold text-sky-200/60 transition-colors group-hover:text-sky-200">
            Open post →
          </span>
        </div>

        {comment.isDeleted ? (
          <p className="mt-4 rounded-2xl border border-white/6 bg-white/2 px-4 py-3 text-sm italic text-white/30">
            This comment was deleted.
          </p>
        ) : (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/60">
            {renderContentWithMentions(comment.content)}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/6 pt-4">
          <Badge tone="muted" className="rounded-2xl px-3 py-1.5">
            {comment.likeCount} {comment.likeCount === 1 ? "like" : "likes"}
          </Badge>
        </div>
      </div>
    </article>
  );
}
