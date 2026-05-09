import bcrypt from "bcryptjs";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { AuthUserDto } from "../../Domain/DTOs/auth/AuthUserDto";
import { User } from "../../Domain/models/User";
import { AuthRegisterDto } from "../../Domain/DTOs/auth/AuthRegisterDto";
import { AuthMapper } from "../../Shared/mappers/auth/AuthMapper";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { AuthMessages } from "../../Domain/constants/messages/auth/AuthMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";

export class AuthService implements IAuthService {
  private readonly saltRounds = parseInt(process.env.SALT_ROUNDS ?? "10", 10);

  public constructor(
    private readonly userRepo: IUserRepository,
    private readonly auditHelperService: IAuditHelperService,
  ) {}

  async login(username: string, password: string,ctx: AuditContext): Promise<ServiceResult<AuthUserDto>> {
    const user = await this.userRepo.findByUsername(username);
    if (user.id === 0 || user.isActive === 0) {
      return ServiceResultFactory.fail<AuthUserDto>(AuthMessages.invalidCredentials,HttpStatus.unauthorized);
    }

    const match = await bcrypt.compare(password, user.passwordHash).catch(() => false);
    if (!match){
      return ServiceResultFactory.fail<AuthUserDto>(AuthMessages.invalidCredentials,HttpStatus.unauthorized);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(user.id, AuditActions.LOGIN_SUCCESS, AuditDetails.LOGIN_SUCCESS, ctx.ipAddress));

    return ServiceResultFactory.ok( AuthMessages.loginSuccess,AuthMapper.toAuthUserDto(user),HttpStatus.ok);
  }

  async register(dto: AuthRegisterDto,ctx: AuditContext): Promise<ServiceResult<AuthUserDto>> {
    const byName = await this.userRepo.findByUsername(dto.username);
    if (byName.id !== 0) {
      return ServiceResultFactory.fail<AuthUserDto>(AuthMessages.usernameTaken,HttpStatus.conflict);
    }

    const byEmail = await this.userRepo.findByEmail(dto.email);
    if (byEmail.id !== 0) {
      return ServiceResultFactory.fail<AuthUserDto>(AuthMessages.emailTaken,HttpStatus.conflict);
    }

    const hash = await bcrypt.hash(dto.password, this.saltRounds).catch(() => "");
    if (!hash) {
       return ServiceResultFactory.fail<AuthUserDto>(AuthMessages.registerFailed, HttpStatus.internalServerError);
    }

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

    if (created.id === 0) {
      return ServiceResultFactory.fail<AuthUserDto>(AuthMessages.registerFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(created.id, AuditActions.REGISTER_SUCCESS, AuditDetails.REGISTER_SUCCESS, ctx.ipAddress));

    return ServiceResultFactory.ok(AuthMessages.registerSuccess, AuthMapper.toAuthUserDto(created), HttpStatus.created);
  }

  async logout(ctx:AuditContext): Promise<ServiceResult> {
    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.LOGOUT_SUCCESS, AuditDetails.LOGOUT_SUCCESS, ctx.ipAddress));

    return ServiceResultFactory.ok(AuthMessages.logoutSuccess, undefined, HttpStatus.ok);
  }
}
