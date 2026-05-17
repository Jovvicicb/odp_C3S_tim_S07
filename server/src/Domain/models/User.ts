import { UserRole } from "../enums/users/UserRole";

export class User {
  constructor(
    public id: number        = 0,
    public username: string  = "",
    public email: string     = "",
    public role: UserRole    = UserRole.USER,
    public passwordHash: string = "",
    public fullname: string | null = null,
    public bio: string | null = null,
    public image: string | null = null,
    public isActive: number  = 1,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
