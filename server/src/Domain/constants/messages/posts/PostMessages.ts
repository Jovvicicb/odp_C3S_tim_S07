export const PostMessages = {
  created: "Post created successfully",
  createFailed: "Failed to create post",

  communityNotFound: "Community not found",
  notMember: "You must be a member of this community",

  notFound: "Post not found",

  deleted: "Post deleted successfully",
  deleteFailed: "Failed to delete post",
  onlyAuthorOrModeratorCanDelete:
    "Only the post author or a community moderator can delete this post",

  updated: "Post updated successfully",
  updateFailed: "Failed to update post",
  onlyAuthorOrModeratorCanUpdate:
    "Only the post author or a community moderator can update this post",

  tagNotFound: "Tag not found",
  tagAlreadyAdded: "Tag is already added to this post",
  tagAdded: "Tag added to post successfully",
  addTagFailed: "Failed to add tag to post",
  onlyAuthorOrModeratorCanAddTag:
    "Only the post author or a community moderator can add tags to this post",

  tagNotAdded: "Tag is not added to this post",
  tagRemoved: "Tag removed from post successfully",
  removeTagFailed: "Failed to remove tag from post",
  onlyAuthorOrModeratorCanRemoveTag:
    "Only the post author or a community moderator can remove tags from this post",

  cannotLikePost: "You are not allowed to like this post",
  liked: "Post liked successfully",
  alreadyLiked: "Post is already liked",
  likeFailed: "Failed to like post",

  unliked: "Post unliked successfully",
  notLiked: "Post is not liked",
  unlikeFailed: "Failed to unlike post",
  cannotUnlikePost: "Cannot unlike this post",

  postsFetched: "Posts fetched successfully",
  fetchByCommunityFailed: "Failed to fetch community posts",
  communityPostsForbidden:
    "You are not allowed to view posts from this community",
  privateCommunityPostsForbidden:
    "You are not allowed to view posts from this private community",

  feedFetched: "Feed fetched successfully",
  feedFetchFailed: "Failed to fetch feed",

  detailsFetched: "Post details fetched successfully",
  fetchDetailsFailed: "Failed to fetch post details",
  postAccessForbidden: "You are not allowed to view this post",
  postAccessAllowed: "Post access allowed",
} as const;