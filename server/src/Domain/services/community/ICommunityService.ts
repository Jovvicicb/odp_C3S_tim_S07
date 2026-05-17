import { CommunityDto } from "../../DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { UpdateCommunityDto } from "../../DTOs/community/UpdateCommunityDto";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";
import { CreateCommunityResponseDto } from "../../DTOs/community/CreateCommunityResponseDto";
import { CommunityDetailsDto } from "../../DTOs/community/CommunityDetailsDto";
import { UserRole } from "../../enums/users/UserRole";
import { DiscoverCommunitiesDto } from "../../DTOs/community/DiscoverCommunitiesDto";

export interface ICommunityService {
  getPublic(page: number, limit: number, viewerId?: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  discover(dto: DiscoverCommunitiesDto, viewerId: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  getAll(page: number, limit: number, viewerId?: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  getById(page: number, limit: number, communityId: number, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<CommunityDetailsDto>>;
  create(dto: CreateCommunityDto, ctx:AuditContext): Promise<ServiceResult<CreateCommunityResponseDto>>;
  update(id: number, dto: UpdateCommunityDto, ctx:AuditContext): Promise<ServiceResult>;
  delete(id: number, ctx:AuditContext): Promise<ServiceResult>;
}
