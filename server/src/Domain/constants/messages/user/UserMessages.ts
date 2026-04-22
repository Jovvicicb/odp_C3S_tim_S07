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
  emailTaken: "Email already taken"
} as const;