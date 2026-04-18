import { UpdateCommunityDto } from "../../DTOs/community/UpdateCommunityDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdateCommunityResult = {
  validation: ValidationResult;
  dto?: UpdateCommunityDto;
};