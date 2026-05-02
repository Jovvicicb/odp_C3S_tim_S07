export const CommentMessages = {
  created: "Comment created successfully",
  createFailed: "Failed to create comment",

  notFound: "Comment not found",

  parentNotFound: "Parent comment not found",
  parentPostMismatch: "Parent comment does not belong to this post",
  maxDepthReached: "Replies can only be one level deep",

  notAllowed: "You cannot comment on this post",


  deleted: "Comment deleted successfully",
  deleteFailed: "Failed to delete comment",
  alreadyDeleted: "Comment is already deleted",
  onlyAuthorOrModeratorCanDelete: "Only comment author or community moderator can delete this comment",

  updated: "Comment updated successfully",
  updateFailed: "Failed to update comment",
  onlyAuthorCanUpdate: "Only comment author can update this comment",
  cannotUpdateDeleted: "You cannot update a deleted comment",

  liked: "Comment liked successfully",
  likeFailed: "Failed to like comment",
  alreadyLiked: "Comment is already liked",
  cannotLikeComment: "You cannot like this comment",
  cannotLikeDeletedComment: "You cannot like a deleted comment",

  unliked: "Comment unliked successfully",
  unlikeFailed: "Failed to unlike comment",
  notLiked: "Comment is not liked",

} as const;