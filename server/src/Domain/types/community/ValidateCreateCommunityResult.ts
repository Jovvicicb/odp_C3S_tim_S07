import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateCreateCommunityResult = {
  validation: ValidationResult;
  dto?: CreateCommunityDto;
};