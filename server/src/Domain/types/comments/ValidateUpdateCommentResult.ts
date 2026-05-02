import { UpdateCommentDto } from "../../DTOs/comments/UpdateCommentDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdateCommentResult = {
  validation: ValidationResult;
  dto?: UpdateCommentDto;
};