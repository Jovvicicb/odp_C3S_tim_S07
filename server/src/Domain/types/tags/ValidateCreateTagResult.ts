import { CreateTagDto } from "../../DTOs/tags/CreateTagDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateCreateTagResult = {
  validation: ValidationResult;
  dto?: CreateTagDto;
};