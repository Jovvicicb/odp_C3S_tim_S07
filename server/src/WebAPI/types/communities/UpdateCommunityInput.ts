export type UpdateCommunityInput = {
  name?: string | null;
  description?: string | null;
  rules?: string | null;
  type?: string | null;
  removeAvatar?: boolean | string | null;
};