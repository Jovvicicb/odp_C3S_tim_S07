import { AuthRegisterDto } from "../../DTOs/auth/AuthRegisterDto";
import { AuthUserDto } from "../../DTOs/auth/AuthUserDto";
import { AuditContext } from "../../types/audits/AuditContext";

export interface IAuthService {
  login(username: string, password: string,ctx: AuditContext): Promise<AuthUserDto>;
  register(dto:AuthRegisterDto,ctx: AuditContext): Promise<AuthUserDto>;
  logout(ctx:AuditContext): Promise<void>;
}
