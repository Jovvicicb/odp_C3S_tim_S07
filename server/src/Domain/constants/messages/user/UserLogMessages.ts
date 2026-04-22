export const UserLogMessages = {
   // controller
  getAllFailed: "getAll failed",
  getByIdFailed: "getById failed",
  getByUsernameFailed: "getByUsername failed",
  followFailed: "Follow user failed",
  unfollowFailed: "Unfollow user failed",
  getFollowersFailed: "Get followers failed",
  

  // repository
  findAllFailed: "findAll failed",
  findByIdFailed: "findById failed",
  findByIdsFailed: "findByIds failed",
  findByUsernameFailed: "findByUsername failed",
  findByEmailFailed: "findByEmail failed",
  createFolowUserFaild: "create follow failed",
  deleteFolowUserFaild: "delete follow failed",
  existsFolowUserFaild: "exists follow failed",
  

  // shared
  createFailed: "create failed",
  updateFailed: "update failed",
  updateRoleFailed: "update user role failed",
  deactivateFailed: "deactivate failed",
  existsFailed: "exists failed",
  
} as const;