import type { ApiResponse } from "../../types/common/ApiResponse";
import type { CreateCommunityResponseDto } from "../../models/community/CreateCommunityResponseDto ";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { CommunityDto } from "../../models/community/CommunityDto";

export interface ICommunityAPIService {
  create(formData: FormData): Promise<ApiResponse<CreateCommunityResponseDto>>;
  getAll(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getMine(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
}
