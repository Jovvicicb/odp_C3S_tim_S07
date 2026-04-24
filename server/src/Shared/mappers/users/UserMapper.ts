import { User } from "../../../Domain/models/User";
import { UserDto } from "../../../Domain/DTOs/users/UserDto";
import { RowDataPacket } from "mysql2";
import { UserRole } from "../../../Domain/enums/UserRole";

export class UserMapper {

  public static toModel(row: RowDataPacket): User {
    return new User(
      row.id,
      row.username,
      row.email,
      row.role as UserRole,
      row.password_hash,
      row.fullname ?? null,
      row.bio ?? null,
      row.profile_picture ?? null,
      row.is_active,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
    
  public static toDto(user: User): UserDto {
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
      user.updatedAt
    );
  }
}