export type RegisterInput = {
  username: string;
  fullname: string;
  email: string;
  password: string;
  bio: string;
  imageFile: File | null;
};