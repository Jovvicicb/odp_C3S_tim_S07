export const CommunityLogMessages = {
  // controller
  getAllFailed: "getAll failed",
  getPublicFailed: "get public failed",
  getByIdFailed: "getById failed",
  getByUserIdFailed: "getByUserId failed",
  joinFailed: "Join community failed",
  leaveFailed: "Leave community failed",

  // repository
  findAllFailed: "findAll failed",
  findByIdFailed: "findById failed",
  findByName: "findByName failed",
  findByUserIdFailed: "findByUserId failed",
  findByUserIdAndCommunityid: "Find community member failed",
  exists: "exists failed",


  
  // shared
  createFailed: "create failed",
  updateFailed: "update failed",
  deleteFailed: "delete failed",
} as const;