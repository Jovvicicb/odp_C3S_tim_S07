import bcrypt from "bcryptjs";
import { IUserService } from "../../Domain/services/users/IUserService";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { UserMapper } from "../../Shared/mappers/users/UserMapper";
import { GetUsersDto } from "../../Domain/DTOs/users/GetUsersDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { UpdateMeDto } from "../../Domain/DTOs/users/UpdateMeDto";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { UpdateMeResult } from "../../Domain/types/users/UpdateMeResult";

export class UserService implements IUserService {
  private readonly saltRounds = parseInt(process.env.SALT_ROUNDS ?? "10", 10);
  public constructor(private readonly userRepo: IUserRepository,
    private readonly auditHelperService: IAuditHelperService,
  ) {}

  async getAll(dto:GetUsersDto): Promise<PaginatedListDto<UserDto>> {
    const items = await this.userRepo.findAll(dto);
    return new PaginatedListDto(
    items.users.map((u) => UserMapper.toDto(u)),
    items.total,
    dto.page,
    dto.limit
  );}

  async getById(id: number): Promise<UserDto | null> {
    const user = await this.userRepo.findById(id);
    if (user.id === 0) return null;
    return UserMapper.toDto(user);
  }

  async getByUsername(username: string): Promise<UserDto | null> {
  const user = await this.userRepo.findByUsername(username);
  if (user.id === 0) return null;
  return UserMapper.toDto(user);
  }

  async deactivate(id: number): Promise<boolean> {
    return this.userRepo.deactivate(id);
  }
  async exists(id: number): Promise<boolean> {
  const user = await this.userRepo.findById(id);
  return !!user && user.id !== 0;
  }

  async update(dto: UpdateMeDto,ctx:AuditContext): Promise<UpdateMeResult> {
      const userId = ctx.userId;
       if (!userId) return "failed";

      if (dto.username !== undefined) {
        const byUsername = await this.userRepo.findByUsername(dto.username);
        if (byUsername.id !== 0 && byUsername.id !== userId) {
          return "username_taken";
        }
      }

      if (dto.email !== undefined) {
        const byEmail = await this.userRepo.findByEmail(dto.email);
        if (byEmail.id !== 0 && byEmail.id !== userId) {
          return "email_taken";
        }
      }

      const updateDto = new UpdateMeDto(
        dto.username,
        dto.email,
        dto.password,
        dto.fullname,
        dto.bio,
        dto.profilePicture
      );

      if (dto.password !== undefined) {
        const hash = await bcrypt.hash(dto.password, this.saltRounds).catch(() => "");
        if (!hash) return "failed";
        updateDto.password = hash;
      }

      const isUpdated = await this.userRepo.update(userId, updateDto);
      if (!isUpdated) return "failed";

      await this.auditHelperService.safeCreate(
        new CreateAuditDto(
          userId,
          AuditActions.USER_UPDATED,
          AuditDetails.USER_UPDATED,
          ctx.ipAddress
        )
      );

      return "updated";
  }
}
