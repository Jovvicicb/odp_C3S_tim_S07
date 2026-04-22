import { UserRole } from "../../../Domain/enums/UserRole";
import { ValidationResult } from "../../../Domain/types/ValidationResult";
import { UserValidationMessages } from "../../../Domain/constants/messages/user/UserValidationMessages";

export const validateUpdateUserRole = (role?: string): ValidationResult => {
  if (!role) {
    return { valid: false, message: UserValidationMessages.roleRequired };
  }

  if (!Object.values(UserRole).includes(role as UserRole)) {
    return { valid: false, message: UserValidationMessages.invalidRole };
  }

  return { valid: true };
};