import { CreatePostDto } from "../../DTOs/posts/CreatePostDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateCreatePostResut = {
  validation: ValidationResult;
  dto?: CreatePostDto;
};