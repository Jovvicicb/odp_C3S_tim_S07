import { UserRole } from "../../../Domain/enums/users/UserRole";
import { UserValidationMessages } from "../../../Domain/constants/messages/users/UserValidationMessages";
import { ValidateUpdateRoleResult } from "../../../Domain/types/users/ValidateUpdateRoleResult";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";

export const validateUpdateUserRole = (role?: string | null): ValidateUpdateRoleResult => {
  const normalizedRole = StringNormalizer.trim(role).toLowerCase();
  
  if (!normalizedRole) {
    return {
        validation: { valid: false, message: UserValidationMessages.roleRequired }
    };
  }

  if (!Object.values(UserRole).includes(normalizedRole as UserRole)) {
    return {
        validation: { valid: false, message: UserValidationMessages.invalidRole }
    };
  }

  return {
    validation: { valid: true },
    normalizedRole: normalizedRole as UserRole
  };
};