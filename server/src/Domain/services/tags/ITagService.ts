import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { CreateTagDto } from "../../DTOs/tags/CreateTagDto";
import { TagDto } from "../../DTOs/tags/TagDto";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface ITagService {
  create(dto: CreateTagDto, ctx: AuditContext): Promise<ServiceResult<TagDto>>;
  delete(id: number, ctx: AuditContext): Promise<ServiceResult>;
  getAll(page: number, limit: number): Promise<ServiceResult<PaginatedListDto<TagDto>>>;
}