export const CommentMessages = {
  created: "Comment created successfully",
  createFailed: "Failed to create comment",

  notFound: "Comment not found",

  parentNotFound: "Parent comment not found",
  parentPostMismatch: "Parent comment does not belong to this post",
  maxDepthReached: "Replies can only be one level deep",

  notAllowed: "You are not allowed to comment on this post",

  deleted: "Comment deleted successfully",
  deleteFailed: "Failed to delete comment",
  alreadyDeleted: "Comment is already deleted",
  onlyAuthorOrModeratorCanDelete: "Only the comment author or a community moderator can delete this comment",

  updated: "Comment updated successfully",
  updateFailed: "Failed to update comment",
  onlyAuthorCanUpdate: "Only the comment author can update this comment",
  cannotUpdateDeleted: "Deleted comments cannot be updated",

  liked: "Comment liked successfully",
  likeFailed: "Failed to like comment",
  alreadyLiked: "Comment is already liked",
  cannotLikeComment: "You are not allowed to like this comment",
  cannotLikeDeletedComment: "Deleted comments cannot be liked",

  unliked: "Comment unliked successfully",
  unlikeFailed: "Failed to unlike comment",
  notLiked: "Comment is not liked",
  cannotUnlikeComment: "Cannot unlike this comment",

  fetched: "Comments fetched successfully",
  fetchByPostFailed: "Failed to fetch comments",
  commentsAccessForbidden: "You are not allowed to view comments for this post",

  flagged: "Comment flagged successfully",
  unflagged: "Comment unflagged successfully",
  flagFailed: "Failed to flag comment",
  unflagFailed: "Failed to unflag comment",
  onlyModeratorCanFlag: "Only community moderators can flag comments",
  onlyModeratorCanUnflag: "Only community moderators can unflag comments",
  alreadyFlagged: "Comment is already flagged",
  notFlagged: "Comment is not flagged",
  cannotReplyToDeleted: "Cannot reply to a deleted comment",
  cannotFlagDeleted: "Cannot flag a deleted comment",
  cannotUnflagDeleted: "Cannot unflag a deleted comment",
  accessAllowed: "Comment access allowed",

  userCommentsFetched: "User comments fetched successfully",
  fetchByUserFailed: "Failed to fetch user comments",

} as const;