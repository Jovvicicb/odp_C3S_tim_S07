import type { ApiResponse } from "../../types/common/ApiResponse";
import type { CreateCommunityResponseDto } from "../../models/community/CreateCommunityResponseDto ";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { CommunityDto } from "../../models/community/CommunityDto";
import type { CommunityDiscoverType } from "../../types/community/CommunityDiscoverType";
import type { CommunityDetailsDto } from "../../models/community/CommunityDetailsDto";
import type { CommunityMemberRole } from "../../types/community/CommunityMemberRole";
import type { CommunityMemberStatusAction } from "../../types/community/CommunityMemberStatusAction";
import type { CommunityMemberDetailsDto } from "../../models/community/CommunityMemberDetailsDto";

export interface ICommunityAPIService {
  create(formData: FormData): Promise<ApiResponse<CreateCommunityResponseDto>>;
  discover(page: number, limit: number, type: CommunityDiscoverType, search: string,): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getAll(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getMine(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getPublic(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getById(id: number, membersPage: number, membersLimit: number,): Promise<ApiResponse<CommunityDetailsDto>>;
  join(id: number): Promise<ApiResponse<void>>;
  leave(id: number): Promise<ApiResponse<void>>;

  getJoinRequests(communityId: number, page: number, limit: number,): Promise<ApiResponse<PaginatedListDto<CommunityMemberDetailsDto>>>;
  updateMemberRole( communityId: number, userId: number, role: CommunityMemberRole,): Promise<ApiResponse<void>>;
  updateMemberStatus(communityId: number, userId: number, action: CommunityMemberStatusAction,): Promise<ApiResponse<void>>;
  removeMember(communityId: number, userId: number,): Promise<ApiResponse<void>>;
}
