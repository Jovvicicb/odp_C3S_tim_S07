import { ICommunityService } from "../../Domain/services/community/ICommunityService";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { CommunityDto } from "../../Domain/DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../Domain/DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { CommunityMapper } from "../../Shared/mappers/community/CommunityMapper";
import { GetCommunitiesDto } from "../../Domain/DTOs/community/GetCommunitiesDto";
import { GetCommunitiesByUserIdDto } from "../../Domain/DTOs/community/GetCommunitiesByUserIdDto";
import { UpdateCommunityDto } from "../../Domain/DTOs/community/UpdateCommunityDto";
import { CreateCommunityResponseDto } from "../../Domain/DTOs/community/CreateCommunityResponseDto";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";

export class CommunityService implements ICommunityService {
  public constructor(private readonly communityRepo: ICommunityRepository, private readonly auditHelperService: IAuditHelperService) {}

  async getAll(dto : GetCommunitiesDto): Promise<PaginatedListDto<CommunityDto>> {
    const items = await this.communityRepo.findAll(dto);
    return new PaginatedListDto(
      items.communities.map((c) => CommunityMapper.toDto(c)),
      items.total, 
      dto.page, 
      dto.limit
    );
  }

  async getById(id: number): Promise<CommunityDto | null> {
    const community = await this.communityRepo.findById(id);
    if (community.id === 0) return null;

    return CommunityMapper.toDto(community);
  }

  async getByUserId(dto:GetCommunitiesByUserIdDto):  Promise<PaginatedListDto<CommunityDto>> {
    const items = await this.communityRepo.findByUserId(dto);
    return new PaginatedListDto(
      items.communities.map((c) => CommunityMapper.toDto(c)),
      items.total, 
      dto.page, 
      dto.limit
    );
    }

  async create(dto: CreateCommunityDto,ctx: AuditContext): Promise<CreateCommunityResponseDto | null> {
    const created = await this.communityRepo.create(dto);
    if (created.id === 0) return null;

    await this.auditHelperService.safeCreate(
          new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_CREATED, AuditDetails.COMMUNITY_CREATED, ctx.ipAddress)
        );
    return CommunityMapper.toCreateResponseDto(created);
  }

  async update(id: number, dto: UpdateCommunityDto,ctx:AuditContext): Promise<boolean> {
    const isUpdated = await this.communityRepo.update(id, dto);
    if(isUpdated ){
    await this.auditHelperService.safeCreate(
          new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_UPDATED, AuditDetails.COMMUNITY_UPDATED, ctx.ipAddress)
        );
    }

    return isUpdated;
  }

  async delete(id: number,ctx:AuditContext): Promise<boolean> {
    const isDeleted  = await this.communityRepo.delete(id);
    if(isDeleted ){
    await this.auditHelperService.safeCreate(
          new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_DELETED, AuditDetails.COMMUNITY_DELETED, ctx.ipAddress)
        );
    }
    return isDeleted ;
  }
}
