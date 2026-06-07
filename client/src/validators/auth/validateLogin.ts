import { AuthValidationMessages } from "../../constants/messages/auth/AuthValidationMessages";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import type { ValidationResult } from "../../types/common/ValidationResult";
import type { LoginInput } from "../../types/auth/LoginInput";

export function validateLogin(input?: LoginInput | null): ValidationResult {
  const normalizedUsername = StringNormalizer.trim(input?.username);

  if (!normalizedUsername) {
    return { valid: false, message: AuthValidationMessages.usernameRequired };
  }

  if (normalizedUsername.length < 3 || normalizedUsername.length > 40) {
    return { valid: false, message: AuthValidationMessages.usernameInvalid };
  }

  if (!/^[A-Za-z0-9-]+$/.test(normalizedUsername)) {
    return { valid: false, message: AuthValidationMessages.usernameInvalid };
  }

  if (typeof input?.password !== "string" || !input.password) {
    return { valid: false, message: AuthValidationMessages.passwordRequired };
  }

  if (input.password.length < 8) {
    return { valid: false, message: AuthValidationMessages.passwordInvalid };
  }

  if (!/[A-Z]/.test(input.password)) {
    return { valid: false, message: AuthValidationMessages.passwordInvalid };
  }

  if (!/[0-9]/.test(input.password)) {
    return { valid: false, message: AuthValidationMessages.passwordInvalid };
  }

  return { valid: true, message: "" };
}