import { CreateCommentDto } from "../../DTOs/comments/CreateCommentDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateCreateCommentResult = {
  validation: ValidationResult;
  dto?: CreateCommentDto;
};