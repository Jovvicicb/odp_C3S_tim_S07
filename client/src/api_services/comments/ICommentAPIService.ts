import type { ApiResponse } from "../../types/common/ApiResponse";

export interface ICommentAPIService {
  create(postId: number, content: string, parentId?: number | null): Promise<ApiResponse<void>>;
}