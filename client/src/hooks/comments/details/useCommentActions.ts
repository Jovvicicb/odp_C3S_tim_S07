import type { CommentActionHookProps } from "./CommentActionHookTypes";
import { useCommentLikeActions } from "./useCommentLikeActions";
import { useCommentModerationActions } from "./useCommentModerationActions";
import { useCreateCommentAction } from "./useCreateCommentAction";

export function useCommentActions({
  reloadPostDetails,
  setPostDetails,
}: CommentActionHookProps) {
  const createActions = useCreateCommentAction({
    reloadPostDetails,
  });

  const likeActions = useCommentLikeActions({
    setPostDetails,
  });

  const moderationActions = useCommentModerationActions({
    reloadPostDetails,
  });

  return {
    handleCreateComment: createActions.handleCreateComment,
    handleLikeComment: likeActions.handleLikeComment,
    handleUnlikeComment: likeActions.handleUnlikeComment,
    handleDeleteComment: moderationActions.handleDeleteComment,
    handleFlagComment: moderationActions.handleFlagComment,
    handleUnflagComment: moderationActions.handleUnflagComment,

    loadingCommentCreate: createActions.loadingCommentCreate,
    loadingCommentLikeId: likeActions.loadingCommentLikeId,
    loadingCommentDeleteId: moderationActions.loadingCommentDeleteId,
    loadingCommentFlagId: moderationActions.loadingCommentFlagId,

    commentActionError:
      createActions.commentCreateError ||
      likeActions.commentLikeError ||
      moderationActions.commentModerationError,
  };
}