export const UserLogMessages = {
   // controller
  getAllFailed: "getAll failed",
  getByIdFailed: "getById failed",
  getByUsernameFailed: "getByUsername failed",

  // repository
  findAllFailed: "findAll failed",
  findByIdFailed: "findById failed",
  findByUsernameFailed: "findByUsername failed",
  findByEmailFailed: "findByEmail failed",

  // shared
  createFailed: "create failed",
  updateFailed: "update failed",
  deactivateFailed: "deactivate failed",
  existsFailed: "exists failed",
} as const;