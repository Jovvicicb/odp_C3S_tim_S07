import { UserMessages } from "../../../Domain/constants/messages/users/UserMessages";
import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validateId = (id: number): ValidationResult => {
  if (!Number.isInteger(id) || id < 1) {
    return { valid: false, message: UserMessages.invalidId };
  }

  return { valid: true };
};