import { Empty, Pagination } from "../../ui/UI";
import type { PaginatedListDto } from "../../../models/common/PaginatedListDto";
import type { CommentTreeDto } from "../../../models/comments/CommentTreeDto";
import type { CommentSortType } from "../../../types/comments/CommentSortType";
import { CommentPreviewCard } from "../../comments/CommentPreviewCard";
import { CommentForm } from "../../comments/CommentForm";

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
  onPageChange: (page: number) => void;
  onSortChange: (sort: CommentSortType) => void;
  onCreateComment: (postId: number, content: string) => Promise<boolean>;
  onCreateReply: (parentId: number, content: string) => Promise<boolean>;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
  onDeleteComment: (commentId: number) => void;
  onFlagComment: (commentId: number) => void;
  onUnflagComment: (commentId: number) => void;
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

  onPageChange,
  onSortChange,
  onCreateComment,
  onCreateReply,
  onLikeComment,
  onUnlikeComment,
  onDeleteComment,
  onFlagComment,
  onUnflagComment,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Comments
          </h2>

          <p className="mt-2 text-sm text-white/35">
            {comments.total} root comments · {totalCommentCount} total comments
          </p>
        </div>

        <select
          value={commentsSort}
          onChange={(e) => {
            onPageChange(1);
            onSortChange(e.target.value as CommentSortType);
          }}
          className="w-fit rounded-2xl border border-white/10 bg-[#07111f] px-4 py-2 text-sm font-semibold text-white/80 outline-none transition-all hover:border-sky-300/30 focus:border-sky-300/40"
        >
          <option value="newest" className="bg-[#07111f] text-white">
            Newest
          </option>

          <option value="popular" className="bg-[#07111f] text-white">
            Popular
          </option>
        </select>
      </div>

      {canComment && (
        <div className="mt-6">
          <CommentForm
            loading={loadingCommentCreate}
            onSubmit={(content) => onCreateComment(postId, content)}
          />
        </div>
      )}

      {comments.items.length === 0 ? (
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
                loadingCommentDeleteId={loadingCommentDeleteId}
                loadingCommentFlagId={loadingCommentFlagId}
                onCreateReply={onCreateReply}
                onLikeComment={onLikeComment}
                onUnlikeComment={onUnlikeComment}
                onDeleteComment={onDeleteComment}
                onFlagComment={onFlagComment}
                onUnflagComment={onUnflagComment}
              />
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              page={commentsPage}
              total={comments.total}
              pageSize={commentsLimit}
              onChange={onPageChange}
            />
          </div>
        </>
      )}
    </section>
  );
}
