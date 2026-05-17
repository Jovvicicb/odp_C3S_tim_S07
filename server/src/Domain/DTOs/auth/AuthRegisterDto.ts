import { UserRole } from "../../enums/users/UserRole";

export class AuthRegisterDto {
  constructor(
    public username: string,
    public email: string,
    public role: UserRole,
    public password: string,
    public fullname: string | null,
    public bio: string | null,
    public image: string | null
  ) {}
}