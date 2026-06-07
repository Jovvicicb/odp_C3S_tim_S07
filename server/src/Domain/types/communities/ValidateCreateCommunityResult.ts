import { CreateCommunityDto } from "../../DTOs/communities/CreateCommunityDto";
import { ValidationResult } from "../ValidationResult";

export type ValidateCreateCommunityResult = {
  validation: ValidationResult;
  dto?: CreateCommunityDto;
};