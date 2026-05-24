import type { CommunityType } from "./CommunityType";

export type UpdateCommunityInput = {
  name: string;
  description: string;
  rules: string;
  type: CommunityType;
  avatar?: File;
  removeAvatar: boolean;
};