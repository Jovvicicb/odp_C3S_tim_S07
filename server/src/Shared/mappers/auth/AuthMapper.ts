import { AuthUserDto } from "../../../Domain/DTOs/auth/AuthUserDto";
import { User } from "../../../Domain/models/User";

export class AuthMapper {
  public static toAuthUserDto(user: User): AuthUserDto {
    
    return new AuthUserDto(
      user.id,
      user.username,
      user.role
    );
  }
}