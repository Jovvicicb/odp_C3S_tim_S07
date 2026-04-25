import { ValidationResult } from "../ValidationResult";

export type ValidationLoginResult = {
  validation: ValidationResult;
  validUserName?: string;
  validPassword?: string;
};