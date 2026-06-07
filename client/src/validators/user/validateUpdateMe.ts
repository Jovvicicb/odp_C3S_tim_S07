import { FileValidationMessages } from "../../constants/messages/common/FileValidationMessages";
import { UserValidationMessages } from "../../constants/messages/user/UserValidationMessages";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import type { ValidationResult } from "../../types/common/ValidationResult";
import type { UpdateMeInput } from "../../types/users/UpdateMeInput";

export function validateUpdateMe(input?: UpdateMeInput | null): ValidationResult {
  const normalizedUsername = StringNormalizer.trim(input?.username);
  const normalizedFullname = StringNormalizer.normalizeSpaces(input?.fullname);
  const normalizedEmail = StringNormalizer.normalizeEmail(input?.email);
  const normalizedBio = StringNormalizer.trim(input?.bio);

  if (!normalizedUsername) {
    return { valid: false, message: UserValidationMessages.usernameRequired };
  }

  if (normalizedUsername.length < 3 || normalizedUsername.length > 40) {
    return { valid: false, message: UserValidationMessages.usernameInvalid };
  }

  if (!/^[A-Za-z0-9-]+$/.test(normalizedUsername)) {
    return { valid: false, message: UserValidationMessages.usernameInvalid };
  }

  if (normalizedFullname.length > 100) {
    return { valid: false, message: UserValidationMessages.fullnameInvalid };
  }

  if (!normalizedEmail) {
    return { valid: false, message: UserValidationMessages.emailRequired };
  }

  if (
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(normalizedEmail)
  ) {
    return { valid: false, message: UserValidationMessages.emailInvalid };
  }

  const password = input?.password;

  if (password !== undefined && password !== "") {
    if (typeof password !== "string" || !password) {
      return { valid: false, message: UserValidationMessages.passwordRequired };
    }

    if (password.length < 8) {
      return { valid: false, message: UserValidationMessages.passwordInvalid };
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: UserValidationMessages.passwordInvalid };
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, message: UserValidationMessages.passwordInvalid };
    }
  }

  if (normalizedBio.length > 300) {
    return { valid: false, message: UserValidationMessages.bioTooLong };
  }

  if (input?.imageFile) {
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