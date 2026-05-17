import { UserRole } from "../../enums/users/UserRole";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdateRoleResult = {
  validation: ValidationResult;
  normalizedRole?: UserRole;
};