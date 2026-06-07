import { FileValidationMessages } from '../../../Domain/constants/messages/common/FileValidationMessages';
import { CommunityValidationMessages } from '../../../Domain/constants/messages/communities/CommunityValidationMessages';
import { UpdateCommunityDto } from '../../../Domain/DTOs/communities/UpdateCommunityDto';
import { CommunityType } from '../../../Domain/enums/communities/CommunityType';
import { StringNormalizer } from '../../../Shared/normalization/StringNormalizer';
import { UpdateCommunityInput } from '../../types/communities/UpdateCommunityInput';
import { ValidateUpdateCommunityResult } from '../../../Domain/types/communities/ValidateUpdateCommunityResult';

export const validateUpdateCommunity = (
  input?: UpdateCommunityInput | null,
  file?: Express.Multer.File
): ValidateUpdateCommunityResult => {
  const dto: UpdateCommunityDto = {};

  if (!input && !file) {
    return {
      validation: { valid: false, message: CommunityValidationMessages.noFieldsToUpdate, },
    };
  }

  if (input?.name !== undefined && input.name !== null) {
    const normalizedName = StringNormalizer.normalizeSpaces(input.name);

    if (!normalizedName) {
      return {
        validation: { valid: false, message: CommunityValidationMessages.nameRequired },
      };
    }

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      return {
        validation: {
          valid: false,
          message:CommunityValidationMessages.nameLength,
        },
      };
    }

    dto.name = normalizedName;
  }

  if (input?.description !== undefined && input.description !== null) {
    const normalizedDescription = StringNormalizer.trim(input.description);

    if (normalizedDescription.length > 500) {
      return {
        validation: {
          valid: false,
          message: CommunityValidationMessages.descriptionTooLong,
        },
      };
    }

    dto.description = normalizedDescription ? normalizedDescription : null;
  }

  if (input?.rules !== undefined && input.rules !== null) {
    const normalizedRules = StringNormalizer.trim(input.rules);

    if (normalizedRules.length > 500) {
      return {
        validation: {
          valid: false,
          message: CommunityValidationMessages.rulesTooLong,
        },
      };
    }

    dto.rules = normalizedRules ? normalizedRules : null;
  }
  
  if (input?.type !== undefined && input.type !== null) {
    const normalizedType = StringNormalizer.trim(input.type).toLowerCase();

    if (normalizedType !== CommunityType.PUBLIC && normalizedType !== CommunityType.PRIVATE) {
      return {
        validation: {
          valid: false,
          message: CommunityValidationMessages.invalidType,
        },
      };
    }

    dto.type =
      normalizedType === CommunityType.PUBLIC
        ? CommunityType.PUBLIC
        : CommunityType.PRIVATE;
  }

  if (file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        validation: {
          valid: false,
          message: FileValidationMessages.imageInvalid,
        },
      };
    }

    if (file.size > 2 * 1024 * 1024) {
      return {
        validation: {
          valid: false,
          message: FileValidationMessages.imageTooLarge,
        },
      };
    }

    dto.avatar = file.filename;
  }

  if (input?.removeAvatar === true || input?.removeAvatar === "true") {
    dto.avatar = null;
  }

  if (Object.keys(dto).length === 0) {
    return {
      validation: {
        valid: false,
        message: CommunityValidationMessages.noFieldsToUpdate,
      },
    };
  }

  return {
    validation: { valid: true },
    dto,
  };
};