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

} as const;