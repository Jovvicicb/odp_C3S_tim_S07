export const AuthValidationMessages = {
  usernameRequired: "Username is required",
  usernameInvalid: "Username must be 3 to 40 characters long and contain only letters, numbers, and dash(-)",
  emailRequired: "Email is required",
  emailInvalid: "Email format is invalid",
  passwordRequired: "Password is required",
  passwordInvalid: "Password must be at least 8 characters long and contain at least one uppercase letter and one number",
  fullnameInvalid: "FullName must be between 3 and 100 characters long and contain only letters and spaces",
  bioTooLong: "Bio must be at most 300 characters long",
} as const;