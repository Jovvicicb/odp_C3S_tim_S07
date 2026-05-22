export type UpdateMeInput = {
  username: string;
  fullname: string;
  email: string;
  password: string;
  bio: string;
  imageFile: File | null;
  removeImage: boolean;
};