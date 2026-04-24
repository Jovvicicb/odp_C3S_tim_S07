import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { CommunityDto } from "../../DTOs/community/CommunityDto";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface ICommunityMemberService {
  join(communityId: number, userId: number): Promise<ServiceResult>;
  leave(communityId: number, userId: number): Promise<ServiceResult>;
  getMine(page: number, limit: number, userId: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>>;
}
