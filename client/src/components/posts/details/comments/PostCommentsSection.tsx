import { Empty, Pagination } from "../../../ui/UI";
import type { PaginatedListDto } from "../../../../models/common/PaginatedListDto";
import type { CommentTreeDto } from "../../../../models/comments/CommentTreeDto";
import type { CommentSortType } from "../../../../types/comments/CommentSortType";
import { CommentPreviewCard } from "../../../comments/CommentPreviewCard";
import { CommentForm } from "../../../comments/CommentForm";

type Props = {
  postId: number;
  comments: PaginatedListDto<CommentTreeDto>;
  totalCommentCount: number;
  commentsPage: number;
  commentsLimit: number;
  commentsSort: CommentSortType;
  canComment: boolean;
  loadingCommentCreate: boolean;
  loadingCommentLikeId: number | null;
  loadingCommentDeleteId: number | null;
  loadingCommentFlagId: number | null;
  loadingCommentUpdateId: number | null;
  onPageChange: (page: number) => void;
  onSortChange: (sort: CommentSortType) => void;
  onCreateComment: (postId: number, content: string) => Promise<boolean>;
  onCreateReply: (parentId: number, content: string) => Promise<boolean>;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
  onDeleteComment: (commentId: number) => void;
  onFlagComment: (commentId: number) => void;
  onUnflagComment: (commentId: number) => void;
  onUpdateComment: (commentId: number, content: string) => Promise<boolean>;
};

export function PostCommentsSection({
  postId,
  comments,
  totalCommentCount,
  commentsPage,
  commentsLimit,
  commentsSort,
  canComment,
  loadingCommentCreate,
  loadingCommentLikeId,
  loadingCommentDeleteId,
  loadingCommentFlagId,
  loadingCommentUpdateId,
  onPageChange,
  onSortChange,
  onCreateComment,
  onCreateReply,
  onLikeComment,
  onUnlikeComment,
  onDeleteComment,
  onFlagComment,
  onUnflagComment,
  onUpdateComment,
}: Props) {
  const hasComments = comments.items.length > 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(125,211,252,0.8)]" />

              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-sky-200/70">
                Discussion
              </p>
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
              Comments
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <CommentStatBadge
                label="Root comments"
                value={comments.total}
                tone="primary"
              />

              <CommentStatBadge
                label="Total comments"
                value={totalCommentCount}
                tone="muted"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="text-xs font-semibold text-white/35">
              Sort by
            </label>

            <select
              value={commentsSort}
              onChange={(e) => {
                onPageChange(1);
                onSortChange(e.target.value as CommentSortType);
              }}
              className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-2.5 text-sm font-semibold text-white/80 outline-none transition-all hover:border-sky-300/30 focus:border-sky-300/40"
            >
              <option value="newest" className="bg-[#07111f] text-white">
                Newest
              </option>

              <option value="popular" className="bg-[#07111f] text-white">
                Popular
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {canComment && (
          <CommentForm
            loading={loadingCommentCreate}
            onSubmit={(content) => onCreateComment(postId, content)}
          />
        )}

        {!canComment && (
          <div className="rounded-3xl border border-white/8 bg-white/2.5 px-5 py-4">
            <p className="text-sm text-white/35">
              Sign in or join the discussion to write a comment.
            </p>
          </div>
        )}

        {!hasComments ? (
          <div className="mt-6">
            <Empty message="No comments yet." />
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              {comments.items.map((comment) => (
                <CommentPreviewCard
                  key={comment.id}
                  comment={comment}
                  loadingCommentCreate={loadingCommentCreate}
                  loadingCommentLikeId={loadingCommentLikeId}
                  loadingCommentUpdateId={loadingCommentUpdateId}
                  loadingCommentDeleteId={loadingCommentDeleteId}
                  loadingCommentFlagId={loadingCommentFlagId}
                  onCreateReply={onCreateReply}
                  onLikeComment={onLikeComment}
                  onUnlikeComment={onUnlikeComment}
                  onUpdateComment={onUpdateComment}
                  onDeleteComment={onDeleteComment}
                  onFlagComment={onFlagComment}
                  onUnflagComment={onUnflagComment}
                />
              ))}
            </div>

            <div className="mt-6 border-t border-white/8 pt-5">
              <Pagination
                page={commentsPage}
                total={comments.total}
                pageSize={commentsLimit}
                onChange={onPageChange}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function CommentStatBadge({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "muted";
}) {
  return (
    <span
      className={`rounded-2xl border px-3 py-1.5 text-xs font-semibold ${
        tone === "primary"
          ? "border-sky-300/15 bg-sky-400/10 text-sky-100"
          : "border-white/10 bg-white/5 text-white/45"
      }`}
    >
      {value} {label.toLowerCase()}
    </span>
  );
}
