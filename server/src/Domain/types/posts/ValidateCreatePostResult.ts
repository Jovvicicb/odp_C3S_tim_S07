import { CreatePostDto } from "../../DTOs/posts/CreatePostDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateCreatePostResult = {
  validation: ValidationResult;
  dto?: CreatePostDto;
};