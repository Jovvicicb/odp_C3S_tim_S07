import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { PostDetailsDto } from "../../models/posts/PostDetailsDto";
import type { PostDto } from "../../models/posts/PostDto";
import type { PostWithDetailsDto } from "../../models/posts/PostWithDetailsDto";
import type { CommentSortType } from "../../types/comments/CommentSortType";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { PostSortType } from "../../types/posts/PostSortType";

export interface IPostAPIService {
    create(formData: FormData): Promise<ApiResponse<PostDto>>;
    update(id: number, formData: FormData): Promise<ApiResponse<void>>;
    getByCommunity(communityId: number, page: number, limit: number, sort: PostSortType,): Promise<ApiResponse<PaginatedListDto<PostWithDetailsDto>>>;
    getById(id: number, commentsPage: number, commentsLimit: number, commentsSort: CommentSortType,): Promise<ApiResponse<PostDetailsDto>>;
    like(id: number): Promise<ApiResponse<void>>;
    unlike(id: number): Promise<ApiResponse<void>>;
    delete(id: number): Promise<ApiResponse<void>>;
}