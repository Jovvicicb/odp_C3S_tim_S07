import { UserRole } from "../enums/users/UserRole";
export type JwtPayload = {
  id: number;
  username: string;
  role: UserRole;
};
