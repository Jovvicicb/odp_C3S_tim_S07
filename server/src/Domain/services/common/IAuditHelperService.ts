import { CreateAuditDto } from "../../DTOs/audits/CreateAuditDto";

export interface IAuditHelperService {
  safeCreate(dto: CreateAuditDto): Promise<void>;
}