import { CreateCommentDto } from "../../DTOs/comments/CreateCommentDto";
import { CommentDto } from "../../DTOs/comments/CommentDto";
import { ServiceResult } from "../../types/service/ServiceResult";
import { AuditContext } from "../../types/audits/AuditContext";
import { UpdateCommentDto } from "../../DTOs/comments/UpdateCommentDto";

export interface ICommentService {
  create(dto: CreateCommentDto, ctx: AuditContext): Promise<ServiceResult<CommentDto>>;
  update(id: number, dto: UpdateCommentDto, ctx: AuditContext): Promise<ServiceResult>;
  delete(id: number, ctx: AuditContext): Promise<ServiceResult>;
}