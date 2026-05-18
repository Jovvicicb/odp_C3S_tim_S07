export const UserMessages = {
  notFound: "User not found",
  invalidId: "Invalid ID",

  fetchAllSuccess: "Users fetched successfully",
  followersFetchedSuccess: "Followers fetched successfully",
  followingFetchedSuccess: "Following fetched successfully",
  fetchOneSuccess: "User fetched successfully",

  fetchAllFailed: "Failed to fetch users",
  followersFetchFailed: "Failed to fetch followers",
  followingFetchFailed: "Failed to fetch following",
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
  followed: "User followed successfully",

  cannotUnfollowYourself: "You cannot unfollow yourself",
  notFollowing: "You are not following this user",
  unfollowFailed: "Failed to unfollow user",
  unfollowed: "User unfollowed successfully",

  cannotChangeOwnRole: "You cannot change your own role",

  notYourFollower: "This user is not your follower",
  removeFollowerFailed: "Failed to remove follower",
  followerRemovedSuccessfully: "Follower removed successfully",
  cannotRemoveYourselfFromFollowers: "You cannot remove yourself from followers",

  searchSuccess: "Users found successfully",
  searchFailed: "Failed to search users",
} as const;