import { AuditDto } from "../../Domain/DTOs/audits/AuditDto";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { GetAuditsDto } from "../../Domain/DTOs/audits/GetAuditsDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { IAuditRepository } from "../../Domain/repositories/audits/IAuditRepository";
import { IAuditService } from "../../Domain/services/audits/IAuditService";
import { AuditMapper } from "../../Shared/mappers/audits/AuditMapper";

export class AuditService implements IAuditService {
  public constructor(private readonly auditRepo: IAuditRepository) {}

  async getAll(dto : GetAuditsDto): Promise<PaginatedListDto<AuditDto>> {
    const items = await this.auditRepo.findAll(dto);
    return new PaginatedListDto(
      items.audits.map((c) => AuditMapper.toDto(c)),
      items.total, 
      dto.page, 
      dto.limit
    );
  }

  async create(dto: CreateAuditDto): Promise<AuditDto | null> {
    const created = await this.auditRepo.create(dto);
    if (created.id === 0) return null;
    return AuditMapper.toDto(created);
  }

 
}
