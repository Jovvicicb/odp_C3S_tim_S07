import type { ApiResponse } from "../../types/common/ApiResponse";
import type { CreateCommunityResponseDto } from "../../models/community/CreateCommunityResponseDto ";

export interface ICommunityAPIService {
  create(formData: FormData): Promise<ApiResponse<CreateCommunityResponseDto>>;
}
