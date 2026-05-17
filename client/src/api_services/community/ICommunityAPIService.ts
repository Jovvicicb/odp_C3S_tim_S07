import type { ApiResponse } from "../../types/common/ApiResponse";
import type { CreateCommunityResponseDto } from "../../models/community/CreateCommunityResponseDto ";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { CommunityDto } from "../../models/community/CommunityDto";
import type { CommunityDiscoverType } from "../../types/community/CommunityDiscoverType";

export interface ICommunityAPIService {
  create(formData: FormData): Promise<ApiResponse<CreateCommunityResponseDto>>;
  discover(page: number, limit: number, type: CommunityDiscoverType, search: string,): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getAll(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getMine(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getPublic(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  join(id: number): Promise<ApiResponse<void>>;
  leave(id: number): Promise<ApiResponse<void>>;
}
