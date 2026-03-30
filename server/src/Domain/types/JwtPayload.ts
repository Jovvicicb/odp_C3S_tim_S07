import { UserRole } from "../enums/UserRole";
export type JwtPayload = {
  id: number;
  username: string;
  role: UserRole;
};
