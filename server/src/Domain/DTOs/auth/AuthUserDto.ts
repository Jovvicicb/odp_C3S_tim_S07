import { UserRole } from "../../enums/UserRole";

export class AuthUserDto {
  constructor(
    public id: number       = 0,
    public username: string = "",
    public role: UserRole   = UserRole.USER,
  ) {}
}
