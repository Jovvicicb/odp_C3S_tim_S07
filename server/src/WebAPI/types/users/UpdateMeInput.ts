export type UpdateMeInput = {
  username?: string | null;
  fullname?: string | null;
  email?: string | null;
  password?: string | null;
  bio?: string | null;
  removeImage?: boolean | string | null;
};