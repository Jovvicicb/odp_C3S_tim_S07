import { CreateCommentDto } from "../../DTOs/comments/CreateCommentDto";
import { CommentDto } from "../../DTOs/comments/CommentDto";
import { ServiceResult } from "../../types/service/ServiceResult";
import { AuditContext } from "../../types/audits/AuditContext";
import { UpdateCommentDto } from "../../DTOs/comments/UpdateCommentDto";
import { GetCommentsByPostDto } from "../../DTOs/comments/GetCommentsByPostDto";
import { UserRole } from "../../enums/users/UserRole";
import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { CommentTreeDto } from "../../DTOs/comments/CommentTreeDto";
import { GetCommentsByUserDto } from "../../DTOs/comments/GetCommentsByUserDto";
import { UserProfileCommentDto } from "../../DTOs/comments/UserProfileCommentDto";

export interface ICommentService {
  getByUser(dto: GetCommentsByUserDto, viewerId?: number, viewerRole?: UserRole,): Promise<ServiceResult<PaginatedListDto<UserProfileCommentDto>>>;
  create(dto: CreateCommentDto, ctx: AuditContext): Promise<ServiceResult<CommentDto>>;
  update(id: number, dto: UpdateCommentDto, ctx: AuditContext): Promise<ServiceResult>;
  delete(id: number, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult>;
  getByPost(dto: GetCommentsByPostDto, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<PaginatedListDto<CommentTreeDto>>>;
  flag(id: number, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult>;
  unflag(id: number, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult>;
}