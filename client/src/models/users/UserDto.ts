import type { UserFollowStatus } from "../../types/users/UserFollowStatus";
import type { UserRole } from "../../types/users/UserRole";

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
  followStatus: UserFollowStatus | null;
  followersCount: number;
  followingCount: number;
};