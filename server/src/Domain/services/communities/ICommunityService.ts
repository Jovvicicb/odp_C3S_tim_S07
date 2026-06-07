import { CommunityDto } from "../../DTOs/communities/CommunityDto";
import { CreateCommunityDto } from "../../DTOs/communities/CreateCommunityDto";
import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { UpdateCommunityDto } from "../../DTOs/communities/UpdateCommunityDto";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";
import { CreateCommunityResponseDto } from "../../DTOs/communities/CreateCommunityResponseDto";
import { CommunityDetailsDto } from "../../DTOs/communities/CommunityDetailsDto";
import { UserRole } from "../../enums/users/UserRole";
import { DiscoverCommunitiesDto } from "../../DTOs/communities/DiscoverCommunitiesDto";

export interface ICommunityService {
  getPublic(page: number, limit: number, viewerId?: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  discover(dto: DiscoverCommunitiesDto, viewerId: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  getAll(page: number, limit: number, viewerId?: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  getById(page: number, limit: number, communityId: number, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<CommunityDetailsDto>>;
  create(dto: CreateCommunityDto, ctx:AuditContext): Promise<ServiceResult<CreateCommunityResponseDto>>;
  update(id: number, dto: UpdateCommunityDto, ctx:AuditContext, requesterRole?:UserRole): Promise<ServiceResult>;
  delete(id: number, ctx:AuditContext, requesterRole?: UserRole): Promise<ServiceResult>;
}
