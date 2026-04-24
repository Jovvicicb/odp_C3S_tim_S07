import { UserRole } from "../../enums/UserRole";

export class UserDto {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public role: UserRole,
    public fullname: string | null,
    public bio: string | null,
    public image: string | null,
    public isActive: number,
    public createdAt: Date,
    public updatedAt: Date 
  ) {}
}
