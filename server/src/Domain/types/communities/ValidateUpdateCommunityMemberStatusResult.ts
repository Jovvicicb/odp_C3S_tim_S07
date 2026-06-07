import { CommunityMemberStatusAction } from "../../enums/communities/CommunityMemberStatusAction";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdateCommunityMemberStatusResult = {
  validation: ValidationResult;
  normalizedAction?: CommunityMemberStatusAction;
};
