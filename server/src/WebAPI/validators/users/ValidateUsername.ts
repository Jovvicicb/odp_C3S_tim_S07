import { UserValidationMessages } from '../../../Domain/constants/messages/user/UserValidationMessages';
import { ValidateUsernameResult } from '../../../Domain/types/users/ValidateUsernameResult';
import { StringNormalizer } from '../../../Shared/normalization/StringNormalizer';

export const validateUsername = (
  username?: string
): ValidateUsernameResult => {
  const normalizedUserName = StringNormalizer.trim(username);

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
  
 return {
    validation: { valid: true },
    normalizedUsername: normalizedUserName
  };
};