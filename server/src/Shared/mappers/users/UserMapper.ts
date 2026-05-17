import { User } from "../../../Domain/models/User";
import { UserDto } from "../../../Domain/DTOs/users/UserDto";
import { RowDataPacket } from "mysql2";
import { UserRole } from "../../../Domain/enums/users/UserRole";
import { UserFollowStatus } from "../../../Domain/enums/users/UserFollowStatus";

export class UserMapper {

  public static toModel(row: RowDataPacket): User {
    return new User(
      Number(row.id),
      String(row.username),
      String(row.email),
      row.role as UserRole,
      String(row.password_hash),
      row.fullname === null ? null : String(row.fullname),
      row.bio === null ? null : String(row.bio),
      row.profile_picture === null ? null : String(row.profile_picture),
      Number(row.is_active),
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
    
  public static toDto(user: User,  followStatus: UserFollowStatus | null = null): UserDto {
    return new UserDto(
      user.id,
      user.username,
      user.email,
      user.role,
      user.fullname,
      user.bio,
      user.image,
      user.isActive,
      user.createdAt,
      user.updatedAt,
      followStatus
    );
  }
}