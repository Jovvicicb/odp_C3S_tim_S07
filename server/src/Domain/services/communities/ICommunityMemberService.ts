import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { CommunityDto } from "../../DTOs/communities/CommunityDto";
import { CommunityMemberDetailsDto } from "../../DTOs/communities/CommunityMemberDetailsDto";
import { CommunityMemberRole } from "../../enums/communities/CommunityMemberRole";
import { CommunityMemberStatusAction } from "../../enums/communities/CommunityMemberStatusAction";
import { UserRole } from "../../enums/users/UserRole";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface ICommunityMemberService {
  join(communityId: number, userId: number): Promise<ServiceResult>;
  leave(communityId: number, userId: number): Promise<ServiceResult>;
  getMine(page: number, limit: number, userId: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
  updateMemberRole(communityId: number, targetUserId: number, role: CommunityMemberRole, ctx: AuditContext): Promise<ServiceResult>;
  updateMemberStatus(communityId: number, targetUserId: number, action: CommunityMemberStatusAction, ctx: AuditContext): Promise<ServiceResult>;
  removeMember(communityId: number, targetUserId: number, ctx: AuditContext): Promise<ServiceResult>;
  getJoinRequests(communityId: number, page: number, limit: number, viewerId: number, viewerRole: UserRole): Promise<ServiceResult<PaginatedListDto<CommunityMemberDetailsDto>>>;
}
