import { FileValidationMessages } from "../../../Domain/constants/messages/common/FileValidationMessages";
import { CommunityValidationMessages } from "../../../Domain/constants/messages/communities/CommunityValidationMessages";
import { CommunityType } from "../../../Domain/enums/communities/CommunityType";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";
import { CreateCommunityInput } from "../../types/communities/CreateCommunityInput";
import { ValidateCreateCommunityResult } from "../../../Domain/types/communities/ValidateCreateCommunityResult";

export const validateCreateCommunity = (
  input?: CreateCommunityInput | null,
  file?: Express.Multer.File
): ValidateCreateCommunityResult => {
  if (!input || !Number.isInteger(input.ownerId) || input.ownerId < 1) {
    return {
      validation: { valid: false, message: CommunityValidationMessages.ownerInvalid },
    };
  }

  const normalizedName = StringNormalizer.normalizeSpaces(input.name);
  const normalizedDescription = StringNormalizer.trim(input.description);
  const normalizedRules = StringNormalizer.trim(input.rules);
  const normalizedType = (StringNormalizer.trim(input.type) || CommunityType.PUBLIC).toLowerCase();

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

  if (normalizedType !== CommunityType.PUBLIC && normalizedType !== CommunityType.PRIVATE) {
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
      description: normalizedDescription ? normalizedDescription : null,
      rules: normalizedRules ? normalizedRules : null,
      type: normalizedType === CommunityType.PUBLIC ? CommunityType.PUBLIC : CommunityType.PRIVATE,
      ownerId: input.ownerId,
      avatar: file?.filename ?? null,
    },
  };
};