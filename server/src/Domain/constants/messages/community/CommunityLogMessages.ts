export const CommunityLogMessages = {
  // controller
  getMyCommunitiesFailed: "Get my communities failed",
  getAllFailed: "getAll failed",
  getPublicFailed: "get public failed",
  getByIdFailed: "getById failed",
  getByUserIdFailed: "getByUserId failed",
  joinFailed: "Join community failed",
  leaveFailed: "Leave community failed",
  removeMemberFailed: "Failed to remove member",

  // repository
  findAllFailed: "findAll failed",
  findByIdFailed: "findById failed",
  findByName: "findByName failed",
  findByUserIdFailed: "findByUserId failed",
  findByUserIdAndCommunityid: "Find community member failed",
  findByIdsFailed: "Find communities by ids failed",
  findMyCommunitiesFailed: "Find my communities failed",
  findMembersFailed: "Find community members failed",
  exists: "exists failed",
  updateMemberRoleFailed: "Update community member role failed",
  updateMemberStatusFailed: "Update community member status failed",


  
  // shared
  createFailed: "create failed",
  updateFailed: "update failed",
  deleteFailed: "delete failed",
} as const;