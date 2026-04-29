import { ValidationResult } from "../ValidationResult";

export type ValidateAddTagResult = {
  validation: ValidationResult;
  tagId?: number;
};