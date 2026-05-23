import { CreateTagDto } from "../../../Domain/DTOs/tags/CreateTagDto";
import { TagValidationMessages } from "../../../Domain/constants/messages/tags/TagValidationMessages";
import { ValidateCreateTagResult } from "../../../Domain/types/tags/ValidateCreateTagResult";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";

export const validateCreateTag = (
  input: { name?: string | null }
): ValidateCreateTagResult => {
  const normalizedName =
    typeof input.name === "string"
      ? StringNormalizer.normalizeSpaces(input.name).toLowerCase()
      : "";

  if (!normalizedName) {
    return {
      validation: { valid: false, message: TagValidationMessages.nameRequired },
    };
  }

  if (normalizedName.length < 2 || normalizedName.length > 50) {
    return {
      validation: { valid: false, message: TagValidationMessages.nameLength },
    };
  }

  return {
    validation: { valid: true },
    dto: new CreateTagDto(normalizedName),
  };
};