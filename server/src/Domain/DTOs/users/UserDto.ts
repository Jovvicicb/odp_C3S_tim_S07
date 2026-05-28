import { UserFollowStatus } from "../../enums/users/UserFollowStatus";
import { UserRole } from "../../enums/users/UserRole";

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
    public updatedAt: Date,
    public followStatus: UserFollowStatus | null = null,
    public followersCount: number = 0,
    public followingCount: number = 0,
  ) {}
}
