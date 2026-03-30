import { UserRole } from "../../enums/UserRole";

export class UserDto {
  constructor(
    public id: number       = 0,
    public username: string = "",
    public email: string    = "",
    public role: UserRole   = UserRole.USER,
    public isActive: number = 1,
  ) {}
}
