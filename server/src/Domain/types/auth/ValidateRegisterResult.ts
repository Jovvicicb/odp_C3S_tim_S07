import { ValidationResult } from "../ValidationResult";
import { AuthRegisterDto } from "../../DTOs/auth/AuthRegisterDto";

export type ValidateRegisterResult = {
  validation: ValidationResult;
  dto?: AuthRegisterDto;
};