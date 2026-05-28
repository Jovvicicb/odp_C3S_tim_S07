import type { UserProfileCommentDto } from "../../models/comments/UserProfileCommentDto";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface ICommentAPIService {
  create(postId: number, content: string, parentId?: number | null): Promise<ApiResponse<void>>;
  update(id: number, content: string): Promise<ApiResponse<void>>;
  getByUser(userId: number, page: number, limit: number,): Promise<ApiResponse<PaginatedListDto<UserProfileCommentDto>>>;
  like(id: number): Promise<ApiResponse<void>>;
  unlike(id: number): Promise<ApiResponse<void>>;
  delete(id: number): Promise<ApiResponse<void>>;
  flag(id: number): Promise<ApiResponse<void>>;
  unflag(id: number): Promise<ApiResponse<void>>;
}