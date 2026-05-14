import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { UserDto } from "../../models/user/UserDto";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { UserRole } from "../../types/user/UserRole";

export interface IUsersAPIService {
  getAll(page: number, limit: number): Promise<ApiResponse<PaginatedListDto<UserDto>>>;
  getById(id: number): Promise<ApiResponse<UserDto>>;
  updateMe(formData: FormData): Promise<ApiResponse<void>>;
  updateRole(id: number, role: UserRole): Promise<ApiResponse<void>>;
}
