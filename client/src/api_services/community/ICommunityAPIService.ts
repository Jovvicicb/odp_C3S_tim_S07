import type { ApiResponse } from "../../types/common/ApiResponse";
import type { CreateCommunityResponseDto } from "../../models/community/CreateCommunityResponseDto ";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { CommunityDto } from "../../models/community/CommunityDto";
import type { CommunityDiscoverType } from "../../types/community/CommunityDiscoverType";
import type { CommunityDetailsDto } from "../../models/community/CommunityDetailsDto";

export interface ICommunityAPIService {
  create(formData: FormData): Promise<ApiResponse<CreateCommunityResponseDto>>;
  discover(page: number, limit: number, type: CommunityDiscoverType, search: string,): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getAll(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getMine(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getPublic(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getById(id: number, membersPage: number, membersLimit: number,): Promise<ApiResponse<CommunityDetailsDto>>;
  join(id: number): Promise<ApiResponse<void>>;
  leave(id: number): Promise<ApiResponse<void>>;
}
