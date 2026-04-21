import { UpdateMeDto } from "../../DTOs/users/UpdateMeDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdateMeResult = {
  validation: ValidationResult;
  dto?: UpdateMeDto;
};