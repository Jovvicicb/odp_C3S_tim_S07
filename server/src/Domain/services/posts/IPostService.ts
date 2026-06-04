import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { CreatePostDto } from "../../DTOs/posts/CreatePostDto";
import { GetAdminPostsDto } from "../../DTOs/posts/GetAdminPostsDto";
import { GetPostsByCommunityDto } from "../../DTOs/posts/GetPostsByCommunityDto";
import { GetPostsByUserDto } from "../../DTOs/posts/GetPostsByUserDto";
import { PostDetailsDto } from "../../DTOs/posts/PostDetailsDto";
import { PostDto } from "../../DTOs/posts/PostDto";
import { PostWithDetailsDto } from "../../DTOs/posts/PostWithDetailsDto";
import { UpdatePostDto } from "../../DTOs/posts/UpdatePostDto";
import { CommentSortType } from "../../enums/comments/CommentSortType";
import { UserRole } from "../../enums/users/UserRole";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IPostService {
    getAllForAdmin(dto: GetAdminPostsDto): Promise<ServiceResult<PaginatedListDto<PostWithDetailsDto>>>;
    getFeed(userId: number, page: number, limit: number): Promise<ServiceResult<PaginatedListDto<PostWithDetailsDto>>>;
    getByCommunity(dto: GetPostsByCommunityDto, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<PaginatedListDto<PostWithDetailsDto>>>;
    getById(id: number, commentsPage: number, commentsLimit: number, commentsSort: CommentSortType, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<PostDetailsDto>>;
    getByUser(dto: GetPostsByUserDto, viewerId?: number, viewerRole?: UserRole,): Promise<ServiceResult<PostWithDetailsDto[]>>;
    create(dto: CreatePostDto, ctx:AuditContext): Promise<ServiceResult<PostDto>>;
    update(id: number, dto: UpdatePostDto, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult>;
    delete(id: number, ctx: AuditContext,  requesterRole?: UserRole): Promise<ServiceResult>;
}