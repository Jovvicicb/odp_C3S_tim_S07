import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { UserDto } from "../../models/user/UserDto";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IUsersAPIService {
  getAll(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<UserDto>>>;
}
