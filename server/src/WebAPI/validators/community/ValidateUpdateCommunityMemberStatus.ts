import { CommunityValidationMessages } from "../../../Domain/constants/messages/community/CommunityValidationMessages";
import { CommunityMemberStatusAction } from "../../../Domain/enums/communities/CommunityMemberStatusAction";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";

export const validateUpdateCommunityMemberStatus = (action?: string) => {
  const normalizedAction = StringNormalizer.trim(action).toLowerCase();

  if (!normalizedAction) {
    return {
      validation: {
        valid: false,
        message: CommunityValidationMessages.statusActionRequired,
      },
    };
  }

  if (
    normalizedAction !== CommunityMemberStatusAction.ACCEPT &&
    normalizedAction !== CommunityMemberStatusAction.DENY
  ) {
    return {
      validation: {
        valid: false,
        message: CommunityValidationMessages.invalidStatusAction,
      },
    };
  }

  return {
    validation: { valid: true },
    normalizedAction:
      normalizedAction === CommunityMemberStatusAction.ACCEPT
        ? CommunityMemberStatusAction.ACCEPT
        : CommunityMemberStatusAction.DENY,
  };
};