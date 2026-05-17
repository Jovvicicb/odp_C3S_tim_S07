import { CommunityType } from "../../../Domain/enums/communities/CommunityType";

export const validateCommunityDiscoverType = (
  type?: string
): CommunityType | null => {
  const normalizedType = type?.trim().toLowerCase();

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