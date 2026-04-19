import bcrypt from "bcryptjs";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { AuthUserDto } from "../../Domain/DTOs/auth/AuthUserDto";
import { User } from "../../Domain/models/User";
import { AuthRegisterDto } from "../../Domain/DTOs/auth/AuthRegisterDto";
import { AuthMapper } from "../../Shared/mappers/auth/AuthMapper";

export class AuthService implements IAuthService {
  private readonly saltRounds = parseInt(process.env.SALT_ROUNDS ?? "10", 10);

  public constructor(private readonly userRepo: IUserRepository) {}

  async login(username: string, password: string): Promise<AuthUserDto> {
    const user = await this.userRepo.findByUsername(username);
    if (user.id === 0 || user.isActive === 0) return new AuthUserDto();
    const match = await bcrypt.compare(password, user.passwordHash).catch(() => false);
    if (!match) return new AuthUserDto();
    return AuthMapper.toAuthUserDto(user);
  }

  async register(dto: AuthRegisterDto): Promise<AuthUserDto> {
    const byName = await this.userRepo.findByUsername(dto.username);
    if (byName.id !== 0) return new AuthUserDto();
    const byEmail = await this.userRepo.findByEmail(dto.email);
    if (byEmail.id !== 0) return new AuthUserDto();
    const hash = await bcrypt.hash(dto.password, this.saltRounds).catch(() => "");
    if (!hash) return new AuthUserDto();
   const created = await this.userRepo.create(
    new User(
      0, 
      dto.username, 
      dto.email, 
      dto.role, 
      hash,
      dto.fullname,
      dto.bio,
      dto.image
      )
    );
    if (created.id === 0) return new AuthUserDto();
    return AuthMapper.toAuthUserDto(created);
  }
}
