import type { CommunityType } from "./CommunityType";

export type CreateCommunityInput = {
  name: string;
  description: string;
  rules: string;
  type: CommunityType;
  avatar: File | null;
};