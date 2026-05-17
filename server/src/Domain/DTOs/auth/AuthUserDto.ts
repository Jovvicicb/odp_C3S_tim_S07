import { UserRole } from "../../enums/users/UserRole";

export class AuthUserDto {
  constructor(
    public id: number,
    public username: string,
    public role: UserRole,
  ) {}
}
