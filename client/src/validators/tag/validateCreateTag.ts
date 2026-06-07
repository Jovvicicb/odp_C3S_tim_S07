import { TagValidationMessages } from "../../constants/messages/tag/TagValidationMessages";
import { StringNormalizer } from "../../helpers/normalization/StringNormalizer";
import type { ValidationResult } from "../../types/common/ValidationResult";
import type { CreateTagInput } from "../../types/tags/CreateTagInput";

export type ValidateCreateTagResult = ValidationResult & {
  normalizedName?: string;
};

export function validateCreateTag(
  input?: CreateTagInput | null,
): ValidateCreateTagResult {
  const normalizedName = StringNormalizer.normalizeSpaces(input?.name).toLowerCase();

  if (!normalizedName) {
    return {
      valid: false,
      message: TagValidationMessages.nameRequired,
    };
  }

  if (normalizedName.length < 2 || normalizedName.length > 50) {
    return {
      valid: false,
      message: TagValidationMessages.nameLength,
    };
  }

  return {
    valid: true,
    message: "",
    normalizedName,
  };
}