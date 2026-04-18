export type CreateCommunityInput = {
  name?: string;
  description?: string;
  rules?: string;
  type?: string;
  ownerId: number;
};