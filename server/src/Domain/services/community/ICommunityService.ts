import { CommunityDto } from "../../DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { GetCommunitiesByUserIdDto } from "../../DTOs/community/GetCommunitiesByUserIdDto";
import { UpdateCommunityDto } from "../../DTOs/community/UpdateCommunityDto";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface ICommunityService {
  getPublic(page: number, limit: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  getAll(page: number, limit: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  getById(id: number): Promise<ServiceResult<CommunityDto>>;
  getByUserId(dto:GetCommunitiesByUserIdDto): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  create(dto: CreateCommunityDto, ctx:AuditContext): Promise<ServiceResult<CommunityDto>>;
  update(id: number, dto: UpdateCommunityDto, ctx:AuditContext): Promise<ServiceResult>;
  delete(id: number, ctx:AuditContext): Promise<ServiceResult>;
}
