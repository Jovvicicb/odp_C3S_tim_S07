import type { ApiResponse } from "../../types/common/ApiResponse";

export interface ICommentAPIService {
  create(postId: number, content: string, parentId?: number | null): Promise<ApiResponse<void>>;
  like(id: number): Promise<ApiResponse<void>>;
  unlike(id: number): Promise<ApiResponse<void>>;
}