import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { PostDetailsDto } from "../../models/post/PostDetailsDto";
import type { PostDto } from "../../models/post/PostDto";
import type { PostWithDetailsDto } from "../../models/post/PostWithDetailsDto";
import type { CommentSortType } from "../../types/comment/CommentSortType";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { PostSortType } from "../../types/post/PostSortType";

export interface IPostAPIService {
    create(formData: FormData): Promise<ApiResponse<PostDto>>;
    getByCommunity(communityId: number, page: number, limit: number, sort: PostSortType,): Promise<ApiResponse<PaginatedListDto<PostWithDetailsDto>>>;
    getById(id: number, commentsPage: number, commentsLimit: number, commentsSort: CommentSortType,): Promise<ApiResponse<PostDetailsDto>>;
    like(id: number): Promise<ApiResponse<void>>;
    unlike(id: number): Promise<ApiResponse<void>>;
}