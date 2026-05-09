import { AuthValidationMessages } from "../../constants/messages/auth/AuthValidationMessages";
import { FileValidationMessages } from "../../constants/messages/common/FileValidationMessages";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import type { ValidationResult } from "../../types/common/ValidationResult";
import type { RegisterInput } from "../../types/auth/RegisterInput";

export function validateRegister(input: RegisterInput): ValidationResult {
  const normalizedUserName = StringNormalizer.trim(input.username);
  const normalizedFullname = StringNormalizer.normalizeSpaces(input.fullname);
  const normalizedEmail = StringNormalizer.normalizeEmail(input.email);
  const normalizedBio = StringNormalizer.trim(input.bio);

  if (!normalizedUserName) {
    return { valid: false, message: AuthValidationMessages.usernameRequired };
  }

  if (normalizedUserName.length < 3 || normalizedUserName.length > 40) {
    return { valid: false, message: AuthValidationMessages.usernameInvalid };
  }

  if (!/^[A-Za-z0-9-]+$/.test(normalizedUserName)) {
    return { valid: false, message: AuthValidationMessages.usernameInvalid };
  }

  if (normalizedFullname.length > 100) {
    return { valid: false, message: AuthValidationMessages.fullnameInvalid };
  }

  if (!normalizedEmail) {
    return { valid: false, message: AuthValidationMessages.emailRequired };
  }

  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(normalizedEmail)) {
    return { valid: false, message: AuthValidationMessages.emailInvalid };
  }

  if (!input.password) {
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

  if (normalizedBio.length > 300) {
    return { valid: false, message: AuthValidationMessages.bioTooLong };
  }

  if (input.imageFile) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(input.imageFile.type)) {
      return { valid: false, message: FileValidationMessages.imageInvalid };
    }

    if (input.imageFile.size > 2 * 1024 * 1024) {
      return { valid: false, message: FileValidationMessages.imageTooLarge };
    }
  }

  return { valid: true, message: "" };
}