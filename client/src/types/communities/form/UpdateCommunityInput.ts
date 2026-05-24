import type { CommunityType } from "../common/CommunityType";

export type UpdateCommunityInput = {
  name: string;
  description: string;
  rules: string;
  type: CommunityType;
  avatar?: File;
  removeAvatar: boolean;
};