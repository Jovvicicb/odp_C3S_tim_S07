import type { UserRole } from "../../types/user/UserRole";

export type UserDto = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  fullname: string | null;
  bio: string | null;
  image: string | null;
  isActive: number;
  createdAt: string;
  updatedAt: string;
};