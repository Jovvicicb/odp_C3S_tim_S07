import { AuditDto } from "../../DTOs/audits/AuditDto";
import { CreateAuditDto } from "../../DTOs/audits/CreateAuditDto";
import { GetAuditsDto } from "../../DTOs/audits/GetAuditsDto";
import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";

export interface IAuditService {
  getAll(dto:GetAuditsDto): Promise<PaginatedListDto<AuditDto>>;
  create(dto: CreateAuditDto): Promise<AuditDto | null>;
}
