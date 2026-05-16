import type { CommunityMemberStatus } from "../../types/community/CommunityMemberStatus";
import type { CommunityType } from "../../types/community/CommunityType";

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