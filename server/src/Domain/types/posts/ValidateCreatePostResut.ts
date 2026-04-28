import { CreatePostDto } from "../../DTOs/Posts/CreatePostDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateCreatePostResut = {
  validation: ValidationResult;
  dto?: CreatePostDto;
};