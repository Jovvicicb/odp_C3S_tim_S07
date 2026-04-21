import { ValidationResult } from "../ValidationResult";

export type ValidateUsernameResult = {
  validation: ValidationResult;
  normalizedUsername?: string;
};