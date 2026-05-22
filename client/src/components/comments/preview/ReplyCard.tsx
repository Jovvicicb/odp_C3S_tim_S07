import { useState } from "react";
import type { CommentTreeDto } from "../../../models/comments/CommentTreeDto";
import { CommentForm } from "../CommentForm";
import { CommentActions } from "./CommentActions";
import { CommentContent } from "./CommentContent";
import { CommentHeader } from "./CommentHeader";

type Props = {
  reply: CommentTreeDto;
  loadingCommentLikeId: number | null;
  loadingCommentUpdateId: number | null;
  loadingCommentDeleteId: number | null;
  loadingCommentFlagId: number | null;
  onLikeComment: (commentId: number) => void;
  onUnlikeComment: (commentId: number) => void;
  onUpdateComment: (commentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => void;
  onFlagComment: (commentId: number) => void;
  onUnflagComment: (commentId: number) => void;
};

export function ReplyCard({
  reply,
  loadingCommentLikeId,
  loadingCommentUpdateId,
  loadingCommentDeleteId,
  loadingCommentFlagId,
  onLikeComment,
  onUnlikeComment,
  onUpdateComment,
  onDeleteComment,
  onFlagComment,
  onUnflagComment,
}: Props) {
  const [editing, setEditing] = useState(false);

  const handleUpdateReply = async (content: string) => {
    const success = await onUpdateComment(reply.id, content);

    if (success) {
      setEditing(false);
    }

    return success;
  };

  return (
    <article className="rounded-2xl border border-white/6 bg-black/10 p-4">
      <CommentHeader comment={reply} label="Reply" />

      {editing ? (
        <div className="mt-4">
          <CommentForm
            title="Edit reply"
            description="Update your reply content."
            placeholder="Edit your reply..."
            submitLabel="Save changes"
            loading={loadingCommentUpdateId === reply.id}
            initialValue={reply.content}
            compact
            onCancel={() => setEditing(false)}
            onSubmit={handleUpdateReply}
          />
        </div>
      ) : (
        <CommentContent comment={reply} compact />
      )}

      {!editing && (
        <CommentActions
          comment={reply}
          loadingCommentLikeId={loadingCommentLikeId}
          loadingCommentUpdateId={loadingCommentUpdateId}
          loadingCommentDeleteId={loadingCommentDeleteId}
          loadingCommentFlagId={loadingCommentFlagId}
          onLikeComment={onLikeComment}
          onUnlikeComment={onUnlikeComment}
          onEditComment={() => setEditing(true)}
          onDeleteComment={onDeleteComment}
          onFlagComment={onFlagComment}
          onUnflagComment={onUnflagComment}
        />
      )}
    </article>
  );
}
