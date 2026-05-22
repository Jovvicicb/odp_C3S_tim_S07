import type { CommentActionHookProps } from "./CommentActionHookTypes";

import { useCommentLikeActions } from "./useCommentLikeActions";
import { useCommentModerationActions } from "./useCommentModerationActions";
import { useCommentUpdateAction } from "./useCommentUpdateAction";
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

  const updateActions = useCommentUpdateAction({
    reloadPostDetails,
  });

  const moderationActions = useCommentModerationActions({
    reloadPostDetails,
  });

  return {
    handleCreateComment: createActions.handleCreateComment,
    handleLikeComment: likeActions.handleLikeComment,
    handleUnlikeComment: likeActions.handleUnlikeComment,
    handleUpdateComment: updateActions.handleUpdateComment,
    handleDeleteComment: moderationActions.handleDeleteComment,
    handleFlagComment: moderationActions.handleFlagComment,
    handleUnflagComment: moderationActions.handleUnflagComment,

    loadingCommentCreate: createActions.loadingCommentCreate,
    loadingCommentLikeId: likeActions.loadingCommentLikeId,
    loadingCommentUpdateId: updateActions.loadingCommentUpdateId,
    loadingCommentDeleteId: moderationActions.loadingCommentDeleteId,
    loadingCommentFlagId: moderationActions.loadingCommentFlagId,

    commentActionError:
      createActions.commentCreateError ||
      likeActions.commentLikeError ||
      updateActions.commentUpdateError ||
      moderationActions.commentModerationError,
  };
}