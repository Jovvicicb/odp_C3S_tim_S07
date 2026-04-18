import { AuthValidationMessages } from "../../../Domain/constants/messages/auth/AuthValidationMessages";
import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validateLogin = (normalizedUserName: string, p: string): ValidationResult => {
  if (!normalizedUserName){
    return { valid: false, message: AuthValidationMessages.usernameRequired };
  }

  if (normalizedUserName.length < 3 || normalizedUserName.length > 40) {
    return { valid: false, message: AuthValidationMessages.usernameInvalid};
  }

  if (!/^[A-Za-z0-9-]+$/.test(normalizedUserName)) {
     return { valid: false, message: AuthValidationMessages.usernameInvalid};
  }

  if (!p) {
    return { valid: false, message: AuthValidationMessages.passwordRequired };
  }
    
  if (p.length < 8) {
    return { valid: false, message: AuthValidationMessages.passwordInvalid};
  }

  if (!/[A-Z]/.test(p)) {
    return { valid: false, message: AuthValidationMessages.passwordInvalid};
  }

  if (!/[0-9]/.test(p)) {
     return { valid: false, message: AuthValidationMessages.passwordInvalid};
  }

  return { valid: true };
};