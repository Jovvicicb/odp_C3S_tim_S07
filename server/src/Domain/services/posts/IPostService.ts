import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { CreatePostDto } from "../../DTOs/Posts/CreatePostDto";
import { GetPostsByCommunityDto } from "../../DTOs/Posts/GetPostsByCommunityDto";
import { GetPostsByUserDto } from "../../DTOs/Posts/GetPostsByUserDto";
import { PostDetailsDto } from "../../DTOs/Posts/PostDetailsDto";
import { PostDto } from "../../DTOs/Posts/PostDto";
import { PostWithDetailsDto } from "../../DTOs/Posts/PostWithDetailsDto";
import { UpdatePostDto } from "../../DTOs/Posts/UpdatePostDto";
import { CommentSortType } from "../../enums/comments/CommentSortType";
import { UserRole } from "../../enums/users/UserRole";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IPostService {
    getFeed(userId: number, page: number, limit: number): Promise<ServiceResult<PaginatedListDto<PostWithDetailsDto>>>;
    getByCommunity(dto: GetPostsByCommunityDto, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<PaginatedListDto<PostWithDetailsDto>>>;
    getById(id: number, commentsPage: number, commentsLimit: number, commentsSort: CommentSortType, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<PostDetailsDto>>;
    getByUser(dto: GetPostsByUserDto, viewerId: number, viewerRole?: UserRole,): Promise<ServiceResult<PostWithDetailsDto[]>>;
    create(dto: CreatePostDto, ctx:AuditContext): Promise<ServiceResult<PostDto>>;
    update(id: number, dto: UpdatePostDto, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult>;
    delete(id: number, ctx: AuditContext,  requesterRole?: UserRole): Promise<ServiceResult>;
    
}