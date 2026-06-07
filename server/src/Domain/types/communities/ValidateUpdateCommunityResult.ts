import { UpdateCommunityDto } from "../../DTOs/communities/UpdateCommunityDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdateCommunityResult = {
  validation: ValidationResult;
  dto?: UpdateCommunityDto;
};