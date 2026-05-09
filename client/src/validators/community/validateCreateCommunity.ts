import { FileValidationMessages } from "../../constants/messages/common/FileValidationMessages";
import { CommunityValidationMessages } from "../../constants/messages/community/CommunityValidationMessages";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import type { ValidationResult } from "../../types/common/ValidationResult";
import type { CreateCommunityInput } from "../../types/community/CreateCommunityInput";

export function validateCreateCommunity(
  input: CreateCommunityInput
): ValidationResult {
  const normalizedName = StringNormalizer.normalizeSpaces(input.name);
  const normalizedDescription = StringNormalizer.trim(input.description);
  const normalizedRules = StringNormalizer.trim(input.rules);
  const normalizedType = (StringNormalizer.trim(input.type) || "public").toLowerCase();

  if (!normalizedName) {
    return { valid: false, message: CommunityValidationMessages.nameRequired };
  }

  if (normalizedName.length < 2 || normalizedName.length > 80) {
    return { valid: false, message: CommunityValidationMessages.nameLength };
  }

  if (normalizedDescription.length > 500) {
    return { valid: false, message: CommunityValidationMessages.descriptionTooLong };
  }

  if (normalizedRules.length > 500) {
    return { valid: false, message: CommunityValidationMessages.rulesTooLong };
  }

  if (normalizedType !== "public" && normalizedType !== "private") {
    return { valid: false, message: CommunityValidationMessages.invalidType, };
  }

  if (input.avatar) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(input.avatar.type)) {
      return { valid: false, message: FileValidationMessages.imageInvalid };
    }

    if (input.avatar.size > 2 * 1024 * 1024) {
      return { valid: false, message: FileValidationMessages.imageTooLarge };
    }
  }

  return { valid: true, message: "" };
}