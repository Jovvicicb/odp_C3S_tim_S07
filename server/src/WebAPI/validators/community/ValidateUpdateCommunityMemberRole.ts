import { CommunityValidationMessages } from "../../../Domain/constants/messages/community/CommunityValidationMessages";
import { CommunityMemberRole } from "../../../Domain/enums/communities/CommunityMemberRole";
import { ValidateUpdateCommunityMemberRoleResult } from "../../../Domain/types/community/ValidateUpdateCommunityMemberRoleResult";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";

export const validateUpdateCommunityMemberRole = (role?: string | null) : ValidateUpdateCommunityMemberRoleResult => {
  const normalizedRole = StringNormalizer.trim(role).toLowerCase();

  if (!normalizedRole) {
    return {
      validation: {
        valid: false,
        message: CommunityValidationMessages.roleRequired,
      },
    };
  }

  if (
    normalizedRole !== CommunityMemberRole.MEMBER &&
    normalizedRole !== CommunityMemberRole.MODERATOR
  ) {
    return {
      validation: {
        valid: false,
        message: CommunityValidationMessages.invalidMemberRole,
      },
    };
  }

  return {
    validation: { valid: true },
    normalizedRole: normalizedRole as CommunityMemberRole,
  };
};