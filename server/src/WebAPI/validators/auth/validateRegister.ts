import { AuthValidationMessages } from '../../../Domain/constants/messages/auth/AuthValidationMessages';
import { FileValidationMessages } from '../../../Domain/constants/messages/common/FileValidationMessages';
import { AuthRegisterDto } from '../../../Domain/DTOs/auth/AuthRegisterDto';
import { UserRole } from '../../../Domain/enums/UserRole';
import { ValidateRegisterResult } from '../../../Domain/types/auth/ValidateRegisterResult';
import { StringNormalizer } from '../../../Shared/normalization/StringNormalizer';
import { RegisterInput } from '../../types/auth/RegisterInput';


export const validateRegister = (
  input: RegisterInput,
  file?: Express.Multer.File
): ValidateRegisterResult => {
  const normalizedUserName = StringNormalizer.trim(input.username);
  const normalizedFullname = StringNormalizer.normalizeSpaces(input.fullname);
  const normalizedEmail = StringNormalizer.normalizeEmail(input.email);
  const normalizedBio = StringNormalizer.trim(input.bio);

  if (!normalizedUserName){
    return {
      validation: { valid: false, message: AuthValidationMessages.usernameRequired},
    };
  }

  if (normalizedUserName.length < 3 || normalizedUserName.length > 40) {
    return {
      validation: { valid: false, message: AuthValidationMessages.usernameInvalid},
    };
  }

  if (!/^[A-Za-z0-9-]+$/.test(normalizedUserName)) {
     return {
      validation: { valid: false, message: AuthValidationMessages.usernameInvalid},
    };
  }
  if(normalizedFullname){
    if (normalizedFullname.length < 3 || normalizedFullname.length > 100) {
      return {
        validation: { valid: false, message: AuthValidationMessages.fullnameInvalid},
      };
    }
    
    if (!/^[A-Za-z\s]+$/.test(normalizedFullname)) {
      return {
       validation: { valid: false, message: AuthValidationMessages.fullnameInvalid},
      };
    }
  } 

  if (!normalizedEmail) {
    return {
      validation: { valid: false, message: AuthValidationMessages.emailRequired},
    };
  }
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(normalizedEmail)) 
  {
    return {
      validation: { valid: false, message: AuthValidationMessages.emailInvalid},
    };
  }

  if (!input.password) {
     return {
      validation: { valid: false, message: AuthValidationMessages.passwordRequired},
    };
 }
    
  if (input.password.length < 8) {
    return {
      validation: { valid: false, message: AuthValidationMessages.passwordInvalid},
    };
 }

  if (!/[A-Z]/.test(input.password)) {
    return {
      validation: { valid: false, message: AuthValidationMessages.passwordInvalid},
    };
    }

  if (!/[0-9]/.test(input.password)) {
     return {
      validation: { valid: false, message: AuthValidationMessages.passwordInvalid},
    };
 }
  if (normalizedBio.length > 300) {
     return {
      validation: { valid: false, message: AuthValidationMessages.bioTooLong},
    };
  }
  
  if (file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        validation: { valid: false, message: FileValidationMessages.imageInvalid},
      };
    }

    if (file.size > 2 * 1024 * 1024) {
      return {
         validation: { valid: false, message: FileValidationMessages.imageTooLarge},
      };
    }
  }   
 return {
    validation: { valid: true },
    dto: new AuthRegisterDto(
      normalizedUserName,
      normalizedEmail,
      UserRole.USER,
      input.password,
      normalizedFullname,
      normalizedBio,
      file?.filename ?? ""
    ),
  };
};