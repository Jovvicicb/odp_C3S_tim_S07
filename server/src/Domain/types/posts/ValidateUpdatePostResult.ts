import { UpdatePostDto } from "../../DTOs/posts/UpdatePostDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdatePostResult = {
  validation: ValidationResult;
  dto?: UpdatePostDto;
};