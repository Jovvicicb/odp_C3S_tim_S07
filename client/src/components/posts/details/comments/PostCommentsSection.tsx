import { Pagination } from "../../../ui/UI";
import { CountBadge } from "../../../ui/CountBadge";
import { SectionCard } from "../../../ui/SectionCard";
import { SectionEmptyState } from "../../../ui/SectionEmptyState";
import { SectionLabel } from "../../../ui/SectionLabel";

import type { PaginatedListDto } from "../../../../models/common/PaginatedListDto";
import type { CommentTreeDto } from "../../../../models/comments/CommentTreeDto";
import type { CommentSortType } from "../../../../types/comments/CommentSortType";

import { CommentPreviewCard } from "../../../comments/card/CommentPreviewCard";
import { CommentForm } from "../../../comments/form/CommentForm";

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
    <SectionCard
      label="Discussion"
      title="Comments"
      description="Read the discussion, sort comments and join the conversation when you have access."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <CountBadge
            count={comments.total}
            singular="root comment"
            plural="root comments"
          />

          <CountBadge
            count={totalCommentCount}
            singular="total comment"
            plural="total comments"
          />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SectionLabel label="Sort comments" tone="muted" />
            <p className="text-xs text-white/30">
              Choose how the discussion should be ordered.
            </p>
          </div>

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

        {canComment ? (
          <CommentForm
            loading={loadingCommentCreate}
            onSubmit={(content) => onCreateComment(postId, content)}
          />
        ) : (
          <SectionEmptyState
            title="Commenting is not available."
            description="Sign in or join the discussion to write a comment."
          />
        )}

        {!hasComments ? (
          <SectionEmptyState
            title="No comments yet."
            description={
              canComment
                ? "Be the first to share your thoughts on this post."
                : "Comments will appear here when the discussion starts."
            }
          />
        ) : (
          <>
            <div className="space-y-4">
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

            <Pagination
              page={commentsPage}
              total={comments.total}
              pageSize={commentsLimit}
              onChange={onPageChange}
            />
          </>
        )}
      </div>
    </SectionCard>
  );
}
