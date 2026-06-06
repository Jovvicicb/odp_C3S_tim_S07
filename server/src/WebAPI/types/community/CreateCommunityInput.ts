export type CreateCommunityInput = {
  name?: string | null;
  description?: string | null;
  rules?: string | null;
  type?: string | null;
  ownerId: number;
};