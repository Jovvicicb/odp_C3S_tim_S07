import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { TagDto } from "../../models/tags/TagDto";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface ITagAPIService {
  getAll( page: number, limit: number,): Promise<ApiResponse<PaginatedListDto<TagDto>>>;
  create(name: string): Promise<ApiResponse<TagDto>>;
  delete(id: number): Promise<ApiResponse<void>>;
}