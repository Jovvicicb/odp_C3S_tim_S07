export const UserMessages = {
  notFound: "User not found",
  invalidId: "Invalid user ID",

  fetchAllSuccess: "Users fetched successfully",
  fetchOneSuccess: "User fetched successfully",

  fetchAllFailed: "Failed to fetch users",
  fetchOneFailed: "Failed to fetch user",

  updated: "User updated successfully",
  roleUpdated: "User role updated successfully",

  updateFailed: "Failed to update user",
  roleUpdateFailed: "Failed to update user role",

  deactivated: "User deactivated successfully",
  deactivateFailed: "Failed to deactivate user",

  unauthorized: "Unauthorized",

  usernameTaken: "Username already taken",
  emailTaken: "Email already taken",

  cannotFollowYourself: "You cannot follow yourself",
  alreadyFollowing: "You are already following this user",
  followFailed: "Failed to follow user",
  followedSuccessfully: "User followed successfully",

  cannotUnFollowYourself: "You cannot unfollow yourself",
  notFollowing: "You are not following this user",
  unfollowFailed: "Failed to unfollow user",
  unfollowedSuccessfully: "User unfollowed successfully",
} as const;