import type { UserDto } from "../../models/user/UserTypes";
import type { PaginatedListDto } from "../../types/community/CommunityTypes";
import type { ApiResponse } from "../../types/community/CommunityTypes";

export interface IUsersAPIService {
  getAll(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<UserDto>>>;
  getById(id: number): Promise<ApiResponse<UserDto>>;
  deactivate(id: number): Promise<ApiResponse<void>>;
}
