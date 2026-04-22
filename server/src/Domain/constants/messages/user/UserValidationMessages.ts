export const UserValidationMessages = {
  usernameRequired: "Username is required",
  usernameInvalid: "Username must be 3 to 40 characters long and contain only letters, numbers, and dash(-)",
  emailRequired: "Email is required",
  emailInvalid: "Email format is invalid",
  passwordRequired: "Password is required",
  passwordInvalid: "Password must be at least 8 characters long and contain at least one uppercase letter and one number",
  fullnameInvalid: "FullName must be at most 100 characters long",
  bioTooLong: "Bio must be at most 300 characters long",
  noFieldsToUpdate: "No fields to update",
  roleRequired: "Role is required",
  invalidRole: "Invalid role",
} as const;