import { AuditDto } from "../../DTOs/audits/AuditDto";
import { CreateAuditDto } from "../../DTOs/audits/CreateAuditDto";
import { GetAuditsDto } from "../../DTOs/audits/GetAuditsDto";
import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { ServiceResult } from '../../types/service/ServiceResult';

export interface IAuditService {
  getAll(dto:GetAuditsDto): Promise<ServiceResult<PaginatedListDto<AuditDto>>>;
  create(dto: CreateAuditDto): Promise<AuditDto | null>;
}
