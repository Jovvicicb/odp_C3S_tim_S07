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
      row.fullname,
      row.bio,
      row.profile_picture,
      row.is_active
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
      user.isActive
    );
  }
}