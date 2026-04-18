import { AuthRegisterDto } from "../../DTOs/auth/AuthRegisterDto";
import { AuthUserDto } from "../../DTOs/auth/AuthUserDto";

export interface IAuthService {
  login(username: string, password: string): Promise<AuthUserDto>;
  register(dto:AuthRegisterDto): Promise<AuthUserDto>;
}
