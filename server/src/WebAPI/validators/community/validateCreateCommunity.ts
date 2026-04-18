import { FileValidationMessages } from "../../../Domain/constants/messages/common/FileValidationMessages";
import { CommunityValidationMessages } from "../../../Domain/constants/messages/community/CommunityValidationMessages";
import { CommunityType } from "../../../Domain/enums/CommunityType";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";
import { CreateCommunityInput } from "../../types/community/CreateCommunityInput";
import { ValidateCreateCommunityResult } from "../../../Domain/types/community/ValidateCreateCommunityResult";

export const validateCreateCommunity = (
  input: CreateCommunityInput,
  file?: Express.Multer.File
): ValidateCreateCommunityResult => {
  const normalizedName = StringNormalizer.normalizeSpaces(input.name);
  const normalizedDescription = StringNormalizer.trim(input.description);
  const normalizedRules = StringNormalizer.trim(input.rules);
  const normalizedType = StringNormalizer.trim(input.type) || "public";

    if (!normalizedName) {
    return {
      validation: { valid: false, message: CommunityValidationMessages.nameRequired },
    };
  }
  if (normalizedName.length < 2 || normalizedName.length > 80) {
    return {
      validation: { valid: false, message: CommunityValidationMessages.nameLength },
    };
  }

  if (normalizedDescription.length > 500) {
    return {
      validation: { valid: false, message: CommunityValidationMessages.descriptionTooLong },
    };
  }

  if (normalizedRules.length > 500) {
    return {
      validation: { valid: false, message: CommunityValidationMessages.rulesTooLong },
    };
  }

  if (normalizedType !== "public" && normalizedType !== "private") {
    return {
      validation: { valid: false, message: CommunityValidationMessages.invalidType },
    };
  }

  if (file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        validation: { valid: false, message: FileValidationMessages.imageInvalid },
      };
    }

    if (file.size > 2 * 1024 * 1024) {
      return {
        validation: { valid: false, message: FileValidationMessages.imageTooLarge },
      };
    }
  }

  return {
    validation: { valid: true },
    dto: {
      name: normalizedName,
      description: normalizedDescription,
      rules: normalizedRules,
      type: normalizedType === "public" ? CommunityType.PUBLIC : CommunityType.PRIVATE,
      ownerId: input.ownerId,
      avatar: file?.filename ?? "",
    },
  };
};