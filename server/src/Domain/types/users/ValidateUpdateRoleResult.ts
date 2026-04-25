import { UserRole } from "../../enums/UserRole";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdateRoleResult = {
  validation: ValidationResult;
  normalizedRole?: UserRole;
};