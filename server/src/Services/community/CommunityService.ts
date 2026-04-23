import { ICommunityService } from "../../Domain/services/community/ICommunityService";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { CommunityDto } from "../../Domain/DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../Domain/DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { CommunityMapper } from "../../Shared/mappers/community/CommunityMapper";
import { GetCommunitiesByUserIdDto } from "../../Domain/DTOs/community/GetCommunitiesByUserIdDto";
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
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { CommunityType } from "../../Domain/enums/CommunityType";

export class CommunityService implements ICommunityService {
  public constructor(
     private readonly communityRepo: ICommunityRepository,
     private readonly userService: IUserService,
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

  async getById(id: number): Promise<ServiceResult<CommunityDto>> {
    const community = await this.communityRepo.findById(id);
    if (community.id === 0) {
      return ServiceResultFactory.fail<CommunityDto>(CommunityMessages.notFound, HttpStatus.notFound);
    }

    return ServiceResultFactory.ok(CommunityMessages.fetchOneSuccess, CommunityMapper.toDto(community),HttpStatus.ok);
  }

  async getByUserId(dto:GetCommunitiesByUserIdDto):  Promise<ServiceResult<PaginatedListDto<CommunityDto>>> {
    const userExists = await this.userService.exists(dto.userId);

    if (!userExists) {
      return ServiceResultFactory.fail(UserMessages.notFound,HttpStatus.notFound);
    }

    const items = await this.communityRepo.findByUserId(dto);

    const data = new PaginatedListDto(
      items.communities.map((c) => CommunityMapper.toDto(c)),
      items.total, 
      dto.page, 
      dto.limit
    );
    return ServiceResultFactory.ok(CommunityMessages.fetchAllSuccess,data,HttpStatus.ok);
  }

  async create(dto: CreateCommunityDto,ctx: AuditContext): Promise<ServiceResult<CommunityDto>> {
    const existing = await this.communityRepo.findByName(dto.name);
    if (existing.id !== 0) {
      return ServiceResultFactory.fail<CommunityDto>(CommunityMessages.nameTaken, HttpStatus.conflict);
    }

    const community = await this.communityRepo.create(dto);
    if (community.id === 0) {
       return ServiceResultFactory.fail<CommunityDto>(CommunityMessages.createFailed, HttpStatus.internalServerError);
    }
    const createdDto =  CommunityMapper.toDto(community);

    await this.auditHelperService.safeCreate( new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_CREATED, AuditDetails.COMMUNITY_CREATED, ctx.ipAddress));

    return ServiceResultFactory.ok(CommunityMessages.created, createdDto, HttpStatus.created);
  }

  async update(id: number, dto: UpdateCommunityDto,ctx:AuditContext): Promise<ServiceResult> {
    const existing = await this.communityRepo.findById(id);
    if (existing.id === 0) {
      return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
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
