import { AuthValidationMessages } from "../../../Domain/constants/messages/auth/AuthValidationMessages";
import { ValidationLoginResult } from "../../../Domain/types/auth/ValidationLoginResult";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";

export const validateLogin = (username?: string | null, password?: string | null): ValidationLoginResult => {
  const normalizedUserName = StringNormalizer.trim(username);
  
  if (!normalizedUserName){
    return {
      validation: { valid: false, message: AuthValidationMessages.usernameRequired  }
    };
  }

  if (normalizedUserName.length < 3 || normalizedUserName.length > 40) {
    return {
      validation: { valid: false, message: AuthValidationMessages.usernameInvalid }
    };
  }

  if (!/^[A-Za-z0-9-]+$/.test(normalizedUserName)) {
    return {
      validation: { valid: false, message: AuthValidationMessages.usernameInvalid }
    };
  }

  if (typeof password !== "string" || !password) {
    return {
      validation: { valid: false, message: AuthValidationMessages.passwordRequired }
    };
  }
    
  if (password.length < 8) {
    return {
      validation: { valid: false, message: AuthValidationMessages.passwordInvalid }
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      validation: { valid: false, message: AuthValidationMessages.passwordInvalid }
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      validation: { valid: false, message: AuthValidationMessages.passwordInvalid }
    };
  }

  return { 
      validation: { valid: true },
      validUserName: normalizedUserName,
      validPassword: password
  };
};