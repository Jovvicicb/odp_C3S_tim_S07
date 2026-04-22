export const UserMessages = {
  notFound: "User not found",
  invalidId: "Invalid user ID",

  fetchAllSuccess: "Users fetched successfully",
  fetchOneSuccess: "User fetched successfully",

  fetchAllFailed: "Failed to fetch users",
  fetchOneFailed: "Failed to fetch user",

  updated: "User updated successfully",
  updateFailed: "Failed to update user",

  deactivated: "User deactivated successfully",
  deactivateFailed: "Failed to deactivate user",

  unauthorized: "Unauthorized",

  usernameTaken: "Username already taken",
  emailTaken: "Email already taken"
} as const;