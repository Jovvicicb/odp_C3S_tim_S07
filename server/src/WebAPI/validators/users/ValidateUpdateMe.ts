import { FileValidationMessages } from '../../../Domain/constants/messages/common/FileValidationMessages';
import { StringNormalizer } from '../../../Shared/normalization/StringNormalizer';
import { UpdateMeInput } from '../../types/users/UpdateMeInput';
import { ValidateUpdateMeResult } from '../../../Domain/types/users/ValidateUpdateMe';
import { UpdateMeDto } from '../../../Domain/DTOs/users/UpdateMeDto';
import { UserValidationMessages } from '../../../Domain/constants/messages/user/UserValidationMessages';

export const validateUpdateMe = (input: UpdateMeInput, file?: Express.Multer.File): ValidateUpdateMeResult => {
    const dto: UpdateMeDto = {};

  if (input.username !== undefined) {
    const normalizedUserName = StringNormalizer.trim(input.username);

    if (!normalizedUserName){
        return {
        validation: { valid: false, message: UserValidationMessages.usernameRequired},
        };
    }

    if (normalizedUserName.length < 3 || normalizedUserName.length > 40) {
        return {
        validation: { valid: false, message: UserValidationMessages.usernameInvalid},
        };
    }

    if (!/^[A-Za-z0-9-]+$/.test(normalizedUserName)) {
        return {
        validation: { valid: false, message: UserValidationMessages.usernameInvalid},
        };
    }

    dto.username = normalizedUserName;
  }

  if (input.fullname !== undefined) {
        const normalizedFullname = StringNormalizer.normalizeSpaces(input.fullname);

        if (normalizedFullname.length > 100) {
            return {
            validation: { valid: false, message: UserValidationMessages.fullnameInvalid },
            };
        }
        dto.fullname = normalizedFullname ? normalizedFullname : null;
   }


  if (input.email !== undefined) {
    const normalizedEmail = StringNormalizer.normalizeEmail(input.email);

    if (!normalizedEmail) {
        return {
        validation: { valid: false, message: UserValidationMessages.emailRequired},
        };
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(normalizedEmail)) 
    {
        return {
        validation: { valid: false, message: UserValidationMessages.emailInvalid},
        };
    }
    dto.email = normalizedEmail;
  }

  if (input.password !== undefined) {

    if (!input.password) {
        return {
        validation: { valid: false, message: UserValidationMessages.passwordRequired},
        };
    }
    
    if (input.password.length < 8) {
        return {
        validation: { valid: false, message: UserValidationMessages.passwordInvalid},
        };
    }

    if (!/[A-Z]/.test(input.password)) {
        return {
        validation: { valid: false, message: UserValidationMessages.passwordInvalid},
        };
        }

    if (!/[0-9]/.test(input.password)) {
        return {
        validation: { valid: false, message: UserValidationMessages.passwordInvalid},
        };
    }
    dto.password = input.password;
  }

  if (input.bio !== undefined) {
    const normalizedBio = StringNormalizer.trim(input.bio);

    if (normalizedBio.length > 300) {
        return {
        validation: { valid: false, message: UserValidationMessages.bioTooLong},
        };
    }
    dto.bio = normalizedBio ? normalizedBio : null;
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

    dto.profilePicture = file.filename;
  }

  if (input.removeImage === true || String(input.removeImage) === "true") {
    dto.profilePicture = null;
  }

  if (Object.keys(dto).length === 0) {
    return {
      validation: {
        valid: false,
        message: UserValidationMessages.noFieldsToUpdate,
      },
    };
  }

  return {
    validation: { valid: true },
    dto,
  };
};