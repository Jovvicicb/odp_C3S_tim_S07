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
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { IUserFollowRepository } from "../../Domain/repositories/users/IUserFollowRepository";
import { UserFollowStatus } from "../../Domain/enums/users/UserFollowStatus";
import { DbManager } from "../../Database/connection/DbConnectionPool";

export class UserService implements IUserService {
    private readonly saltRounds = parseInt(process.env.SALT_ROUNDS ?? "10", 10);
    public constructor(private readonly userRepo: IUserRepository,
    private readonly userFollowRepo: IUserFollowRepository,
    private readonly auditHelperService: IAuditHelperService,
    private readonly db: DbManager,
  ) {}

  async getAll(dto:GetUsersDto): Promise<ServiceResult<PaginatedListDto<UserDto>>> {
    const items = await this.userRepo.findAll(dto);

    const data = new PaginatedListDto(
      items.users.map((u) => UserMapper.toDto(u)),
      items.total,
      dto.page,
      dto.limit
    );

    return ServiceResultFactory.ok(UserMessages.fetchAllSuccess,data,HttpStatus.ok);
  }

  async getById(id: number, viewerId?: number): Promise<ServiceResult<UserDto>> {
    const user = await this.userRepo.findById(id);
    if (user.id === 0) {
      return ServiceResultFactory.fail(UserMessages.notFound, HttpStatus.notFound);
    }

    const [followersCount, followingCount] = await Promise.all([
      this.userFollowRepo.countFollowers(id),
      this.userFollowRepo.countFollowing(id),
    ]);

    const followStatus =
      viewerId === undefined
        ? null
        : viewerId === id
          ? UserFollowStatus.SELF
          : (await this.userFollowRepo.exists(viewerId, id))
            ? UserFollowStatus.FOLLOWING
            : UserFollowStatus.NOT_FOLLOWING;

    const dto = UserMapper.toDto(
      user,
      followStatus,
      followersCount,
      followingCount,
    );

    return ServiceResultFactory.ok(UserMessages.fetchOneSuccess, dto, HttpStatus.ok,);
  }

  async search(username: string, page: number, limit: number, viewerId: number): Promise<ServiceResult<PaginatedListDto<UserDto>>> {
    const result = await this.userRepo.searchByUsername(username, page, limit);

    if (result.users.length === 0) {
    const data = new PaginatedListDto<UserDto>([], result.total, page, limit);

      return ServiceResultFactory.ok(UserMessages.searchSuccess, data, HttpStatus.ok);
    }

    const userIds = result.users.map((user) => user.id);

    const followingIds = await this.userFollowRepo.findFollowingIdsFromList(
      viewerId,
      userIds,
    );

    const followingSet = new Set(followingIds);

    const data = new PaginatedListDto(
      result.users.map((user) => {
        const dto = UserMapper.toDto(user);

        dto.followStatus =
          dto.id === viewerId
            ? UserFollowStatus.SELF
            : followingSet.has(dto.id)
              ? UserFollowStatus.FOLLOWING
              : UserFollowStatus.NOT_FOLLOWING;

        return dto;
      }),
      result.total,
      page,
      limit,
    );


    return ServiceResultFactory.ok(UserMessages.searchSuccess, data, HttpStatus.ok);
  }

  async getByUsername(username: string): Promise<ServiceResult<UserDto>> {
    const user = await this.userRepo.findByUsername(username);
    if (user.id === 0) {
      return ServiceResultFactory.fail(UserMessages.notFound, HttpStatus.notFound);
    }

    return ServiceResultFactory.ok(UserMessages.fetchOneSuccess,UserMapper.toDto(user),HttpStatus.ok);
  }

  async update(dto: UpdateMeDto,ctx:AuditContext): Promise<ServiceResult> {
    const userId = ctx.userId;

    if (dto.username !== undefined) {
      const byUsername = await this.userRepo.findByUsername(dto.username);
      if (byUsername.id !== 0 && byUsername.id !== userId) {
        return ServiceResultFactory.fail(UserMessages.usernameTaken, HttpStatus.conflict);
      }
    }

    if (dto.email !== undefined) {
      const byEmail = await this.userRepo.findByEmail(dto.email);
      if (byEmail.id !== 0 && byEmail.id !== userId) {
        return ServiceResultFactory.fail(UserMessages.emailTaken, HttpStatus.conflict);
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
      if (!hash) {
        return ServiceResultFactory.fail(UserMessages.updateFailed, HttpStatus.internalServerError);
      }
      updateDto.password = hash;
    }

    const writeUnavailableMessage = this.db.getWriteUnavailableMessage();
    if (writeUnavailableMessage) {
      return ServiceResultFactory.fail(writeUnavailableMessage, HttpStatus.serviceUnavailable);
    }

    const isUpdated = await this.userRepo.update(userId, updateDto);
    if (!isUpdated) {
      return ServiceResultFactory.fail(UserMessages.updateFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(
      new CreateAuditDto(userId, AuditActions.USER_UPDATED, AuditDetails.USER_UPDATED, ctx.ipAddress)
    );

    return ServiceResultFactory.ok(UserMessages.updated, undefined, HttpStatus.ok);
  }

  async updateRole(id: number, role: UserRole,ctx:AuditContext): Promise<ServiceResult> {
    const exists = await this.userRepo.exists(id);
    if (!exists) {
      return ServiceResultFactory.fail(UserMessages.notFound,HttpStatus.notFound);
    }

    if (ctx.userId === id) {
      return ServiceResultFactory.fail(UserMessages.cannotChangeOwnRole, HttpStatus.forbidden);
    }

    const writeUnavailableMessage = this.db.getWriteUnavailableMessage();
    if (writeUnavailableMessage) {
      return ServiceResultFactory.fail(writeUnavailableMessage, HttpStatus.serviceUnavailable);
    }

    const isUpdated = await this.userRepo.updateRole(id, role);
    if (!isUpdated) {
      return ServiceResultFactory.fail(UserMessages.roleUpdateFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(
      new CreateAuditDto(ctx.userId, AuditActions.USER_ROLE_CHANGED, AuditDetails.USER_ROLE_CHANGED, ctx.ipAddress)
    );

    return ServiceResultFactory.ok(UserMessages.roleUpdated, undefined, HttpStatus.ok);
  }

  async exists(id: number): Promise<boolean> {
    return this.userRepo.exists(id);
  }
}
