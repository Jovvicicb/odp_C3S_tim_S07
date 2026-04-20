import { Audit } from "../../models/Audit";
import { GetAuditsDto } from '../../DTOs/audits/GetAuditsDto';
import { CreateAuditDto } from "../../DTOs/audits/CreateAuditDto";

export interface IAuditRepository {
  create(dto: CreateAuditDto): Promise<Audit>;
  findAll(dto :GetAuditsDto):Promise<{audits:Audit[];total:number}>;
}