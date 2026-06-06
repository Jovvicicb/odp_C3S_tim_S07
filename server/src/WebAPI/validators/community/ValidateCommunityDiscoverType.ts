import { CommunityType } from "../../../Domain/enums/communities/CommunityType";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";

export const validateCommunityDiscoverType = (
  type?: string | null
): CommunityType | null => {
  const normalizedType = StringNormalizer.trim(type).toLowerCase();

  if (!normalizedType || normalizedType === "all") {
    return null;
  }

  if (normalizedType === CommunityType.PUBLIC) {
    return CommunityType.PUBLIC;
  }

  if (normalizedType === CommunityType.PRIVATE) {
    return CommunityType.PRIVATE;
  }

  return null;
};