import { ICommunityService } from "../../Domain/services/community/ICommunityService";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { CommunityDto } from "../../Domain/DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../Domain/DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { CommunityMapper } from "../../Shared/mappers/community/CommunityMapper";
import { UpdateCommunityDto } from "../../Domain/DTOs/community/UpdateCommunityDto";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { CommunityMessages } from "../../Domain/constants/messages/community/CommunityMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { CommunityMemberRole } from "../../Domain/DTOs/community/CommunityMemberRole";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CreateCommunityResponseDto } from "../../Domain/DTOs/community/CreateCommunityResponseDto";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { CommunityDetailsDto } from "../../Domain/DTOs/community/CommunityDetailsDto";
import { UserMapper } from "../../Shared/mappers/users/UserMapper";

export class CommunityService implements ICommunityService {
  public constructor(
     private readonly communityRepo: ICommunityRepository,
     private readonly communityMemberRepo: ICommunityMemberRepository,
     private readonly userRepo: IUserRepository,
     private readonly auditHelperService: IAuditHelperService
  ) {}

  async getPublic(page: number, limit: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>> {
    const result = await this.communityRepo.findAll(page, limit,CommunityType.PUBLIC);

    const data = new PaginatedListDto(
      result.communities.map((c) => CommunityMapper.toDto(c)),
      result.total, 
      page, 
      limit
    );

    return ServiceResultFactory.ok(CommunityMessages.fetchPublicSuccess,data,HttpStatus.ok);
  }

  async getAll(page: number, limit: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>> {
    const result = await this.communityRepo.findAll(page, limit);

    const data = new PaginatedListDto(
      result.communities.map((c) => CommunityMapper.toDto(c)),
      result.total, 
      page, 
      limit
    );

    return ServiceResultFactory.ok(CommunityMessages.fetchAllSuccess,data,HttpStatus.ok);
  }

  async create(dto: CreateCommunityDto,ctx: AuditContext): Promise<ServiceResult<CreateCommunityResponseDto>> {
    const existing = await this.communityRepo.findByName(dto.name);
    if (existing.id !== 0) {
      return ServiceResultFactory.fail<CreateCommunityResponseDto>(
        CommunityMessages.nameTaken, 
        HttpStatus.conflict
      );
    }

    const community = await this.communityRepo.create(dto);
    if (community.id === 0) {
       return ServiceResultFactory.fail<CreateCommunityResponseDto>(
        CommunityMessages.createFailed, 
        HttpStatus.internalServerError
      );
    }

    const memberCreated = await this.communityMemberRepo.create(
      dto.ownerId,
      community.id,
      CommunityMemberRole.MODERATOR,
      CommunityMemberStatus.ACTIVE
    );

    if (!memberCreated) {
      return ServiceResultFactory.fail<CreateCommunityResponseDto>(
        CommunityMessages.createFailed,
        HttpStatus.internalServerError
      );
    }
    
    const createdDto =  CommunityMapper.toCreateResponseDto(community);

    await this.auditHelperService.safeCreate( new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_CREATED, AuditDetails.COMMUNITY_CREATED, ctx.ipAddress));

    return ServiceResultFactory.ok(CommunityMessages.created, createdDto, HttpStatus.created);
  }

   async getById(page: number, limit: number, communityId: number): Promise<ServiceResult<CommunityDetailsDto>> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0) {
        return ServiceResultFactory.fail(
            CommunityMessages.notFound,
            HttpStatus.notFound
        );
    }

    if (community.type === CommunityType.PRIVATE) {
      return ServiceResultFactory.fail<CommunityDetailsDto>(
        CommunityMessages.privateCommunity,
        HttpStatus.forbidden
      );
    }

    const membersResult  = await this.communityMemberRepo.findUserIdsByCommunityId(page,limit,communityId);

    const users  = await this.userRepo.findByIds(membersResult.usersIds);

    const members = new PaginatedListDto(
        users.map((u) => UserMapper.toDto(u)),
        membersResult.total,
        page,
        limit
    );

    const data = new CommunityDetailsDto(
        CommunityMapper.toDto(community),
        members
    );

    return ServiceResultFactory.ok(
        CommunityMessages.fetchOneSuccess,
        data,
        HttpStatus.ok
    );
  }

  

  async update(id: number, dto: UpdateCommunityDto,ctx:AuditContext): Promise<ServiceResult> {
    const existing = await this.communityRepo.findById(id);
    if (existing.id === 0) {
      return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(ctx.userId, id);
    if (
      membership.id === 0 ||
      membership.role !== CommunityMemberRole.MODERATOR ||
      membership.status !== CommunityMemberStatus.ACTIVE
    ) {
      return ServiceResultFactory.fail(
        CommunityMessages.onlyModeratorCanUpdate,
        HttpStatus.forbidden
      );
    }


    if (dto.name !== undefined) {
      const byName = await this.communityRepo.findByName(dto.name);
      if (byName.id !== 0 && byName.id !== id) {
        return ServiceResultFactory.fail(CommunityMessages.nameTaken, HttpStatus.conflict);
      }
    }
    const isUpdated = await this.communityRepo.update(id, dto);
    
    if (!isUpdated) {
      return ServiceResultFactory.fail(CommunityMessages.updateFailed, HttpStatus.internalServerError);
    }
    await this.auditHelperService.safeCreate( new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_UPDATED, AuditDetails.COMMUNITY_UPDATED, ctx.ipAddress));
    

    return ServiceResultFactory.ok(CommunityMessages.updated, undefined, HttpStatus.ok);
  }

  async delete(id: number,ctx:AuditContext): Promise<ServiceResult> {
    const existing = await this.communityRepo.findById(id);
    if (existing.id === 0) {
      return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    }

    const isDeleted  = await this.communityRepo.delete(id);
    
    if (!isDeleted) {
      return ServiceResultFactory.fail(CommunityMessages.deleteFailed, HttpStatus.internalServerError);
  }

    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_DELETED, AuditDetails.COMMUNITY_DELETED, ctx.ipAddress));
    
    return ServiceResultFactory.ok(CommunityMessages.deleted, undefined, HttpStatus.ok); 
  }
}
