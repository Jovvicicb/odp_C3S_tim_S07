export const CommentLogMessages = {
  createFailed: "Create comment failed",
  findByIdFailed: "Find comment by id failed",
  deleteFailed: "Delete comment failed",
  softDeleteFailed: "Soft delete comment failed",
  updateFailed: "Update comment failed",
  likeFailed: "Like comment failed",
  findLikeFailed: "Find comment like failed",
  unlikeFailed: "Unlike comment failed",

  fetchByPostFailed: "Fetch comments by post failed",
  findRootByPostFailed: "Find root comments by post failed",
  findRepliesFailed: "Find replies failed",
  countLikesFailed: "Count comment likes failed",
  createLikeFailed: "Create comment like failed",
  deleteLikeFailed: "Delete comment like failed",
  existsLikeFailed: "Exists comment like failed",

  flagFailed: "Flag comment failed",
  unflagFailed: "Unflag comment failed",
  updateFlagStatusFailed: "Update comment flag status failed",
  findLikedCommentsFailed: "Find liked comments failed",
  } as const;