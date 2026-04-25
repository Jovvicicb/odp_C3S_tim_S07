import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { CommunityDto } from "../../DTOs/community/CommunityDto";
import { CommunityMemberRole } from "../../enums/communities/CommunityMemberRole";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface ICommunityMemberService {
  join(communityId: number, userId: number): Promise<ServiceResult>;
  leave(communityId: number, userId: number): Promise<ServiceResult>;
  getMine(page: number, limit: number, userId: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  updateMemberRole(communityId: number, targetUserId: number, role: CommunityMemberRole, ctx: AuditContext): Promise<ServiceResult>;
}
