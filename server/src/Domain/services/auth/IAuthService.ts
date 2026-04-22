import { AuthRegisterDto } from "../../DTOs/auth/AuthRegisterDto";
import { AuthUserDto } from "../../DTOs/auth/AuthUserDto";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IAuthService {
  login(username: string, password: string,ctx: AuditContext): Promise<ServiceResult<AuthUserDto>>;
  register(dto:AuthRegisterDto,ctx: AuditContext): Promise<ServiceResult<AuthUserDto>>;
  logout(ctx:AuditContext): Promise<ServiceResult>;
}
