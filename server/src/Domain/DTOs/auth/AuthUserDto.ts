import { UserRole } from "../../enums/UserRole";

export class AuthUserDto {
  constructor(
    public id: number,
    public username: string,
    public role: UserRole,
  ) {}
}
