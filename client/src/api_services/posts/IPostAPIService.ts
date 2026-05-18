import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { PostDto } from "../../models/post/PostDto";
import type { PostWithDetailsDto } from "../../models/post/PostWithDetailsDto";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { PostSortType } from "../../types/post/PostSortType";

export interface IPostAPIService {
    create(formData: FormData): Promise<ApiResponse<PostDto>>;
    getByCommunity(communityId: number, page: number, limit: number, sort: PostSortType,): Promise<ApiResponse<PaginatedListDto<PostWithDetailsDto>>>;
}