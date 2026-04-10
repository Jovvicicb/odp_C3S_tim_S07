export type CommunityDto = {
  id: number;
  name: string;
  description: string;
  rules: string;
  communityType: string;
  ownerId: number;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
};
