import type { CommunityType } from "../common/CommunityType";


export type CreateCommunityInput = {
  name: string;
  description: string;
  rules: string;
  type: CommunityType;
  avatar: File | null;
};