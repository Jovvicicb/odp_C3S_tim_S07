import { CommunityMemberRole } from "../../enums/communities/CommunityMemberRole";
import { ValidationResult } from "../ValidationResult";

export type ValidateUpdateCommunityMemberRoleResult = {
  validation: ValidationResult;
  normalizedRole?: CommunityMemberRole;
};
