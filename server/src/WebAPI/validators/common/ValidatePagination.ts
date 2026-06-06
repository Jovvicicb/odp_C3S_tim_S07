import { PaginationMessages } from "../../../Domain/constants/messages/common/PaginationMessages";
import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validatePagination = (
  page: number,
  limit: number,
): ValidationResult => {
  if (!Number.isInteger(page) || page < 1) {
    return { valid: false, message: PaginationMessages.invalidPage };
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return { valid: false, message: PaginationMessages.invalidLimit };
  }

  return { valid: true };
};