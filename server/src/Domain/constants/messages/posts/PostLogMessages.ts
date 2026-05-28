export const PostLogMessages = {
  // controller
  getFeedFailed: "Get feed failed",
  getByUserFailed: "Get posts by user failed",

  // repository
  findByIdFailed: "Find post by id failed",
  findPostTagFailed: "Find post tag failed",
  findLikeFailed: "Find post like failed",
  findByCommunityFailed: "Find posts by community failed",
  findPostTagsFailed: "Find post tags failed",
  countLikesFailed: "Count post likes failed",
  countCommentsFailed: "Count post comments failed",
  findFeedFailed: "Find feed posts failed",
  findDetailsFailed: "Find post details failed",
  findByAuthorIdFailed: "Find posts by author id failed",
  findAuthorPostCommunityIdsFailed: "Find author post community ids failed",
  findByIdsFailed: "Find posts by ids failed",

  // shared
  createFailed: "Create post failed",
  updateFailed: "Update post failed",
  deleteFailed: "Delete post failed",

  addTagFailed: "Add tag to post failed",
  removeTagFailed: "Remove tag from post failed",

  likeFailed: "Like post failed",
  unlikeFailed: "Unlike post failed",
} as const;