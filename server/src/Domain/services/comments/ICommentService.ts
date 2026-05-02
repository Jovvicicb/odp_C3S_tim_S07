import { CreateCommentDto } from "../../DTOs/comments/CreateCommentDto";
import { CommentDto } from "../../DTOs/comments/CommentDto";
import { ServiceResult } from "../../types/service/ServiceResult";
import { AuditContext } from "../../types/audits/AuditContext";

export interface ICommentService {
  create(dto: CreateCommentDto, ctx: AuditContext): Promise<ServiceResult<CommentDto>>;
  delete(id: number, ctx: AuditContext): Promise<ServiceResult>;
}