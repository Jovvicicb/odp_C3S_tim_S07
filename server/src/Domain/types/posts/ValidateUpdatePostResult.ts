import { UpdatePostDto } from "../../DTOs/Posts/UpdatePostDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdatePostResult = {
  validation: ValidationResult;
  dto?: UpdatePostDto;
};