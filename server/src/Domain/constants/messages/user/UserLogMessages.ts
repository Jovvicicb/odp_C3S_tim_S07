export const UserLogMessages = {
  // controller
  getAllFailed: "Get all users failed",
  getByIdFailed: "Get user by id failed",
  getByUsernameFailed: "Get user by username failed",

  followFailed: "Follow user failed",
  unfollowFailed: "Unfollow user failed",

  // repository
  findAllFailed: "Find all users failed",
  findByIdFailed: "Find user by id failed",
  findByIdsFailed: "Find users by ids failed",
  findByUsernameFailed: "Find user by username failed",
  findByEmailFailed: "Find user by email failed",
  findFollowingIdsFromListFailed: "Find following ids from list failed",
  searchByUsernameFailed: "Search users by username failed",
  createFollowUserFailed: "Create follow failed",
  deleteFollowUserFailed: "Delete follow failed",
  existsFollowUserFailed: "Check follow existence failed",
  removeFollowerFailed: "Remove follower failed",

  // shared
  createFailed: "Create user failed",
  updateFailed: "Update user failed",
  updateRoleFailed: "Update user role failed",
  deactivateFailed: "Deactivate user failed",
  existsFailed: "Check user existence failed",

  getFollowersFailed: "Get followers failed",
  getFollowingFailed: "Get following failed",
} as const;