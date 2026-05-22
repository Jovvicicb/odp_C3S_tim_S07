import type { CommunityMemberStatus } from "../../types/communities/CommunityMemberStatus";
import type { CommunityType } from "../../types/communities/CommunityType";

export type CommunityDto = {
  id: number;
  name: string;
  description: string | null;
  rules: string | null;
  type: CommunityType;
  ownerId: number;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  membershipStatus: CommunityMemberStatus | null;
};