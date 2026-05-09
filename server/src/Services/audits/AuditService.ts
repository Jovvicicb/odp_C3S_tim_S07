import { AuditDto } from "../../Domain/DTOs/audits/AuditDto";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { GetAuditsDto } from "../../Domain/DTOs/audits/GetAuditsDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { IAuditRepository } from "../../Domain/repositories/audits/IAuditRepository";
import { IAuditService } from "../../Domain/services/audits/IAuditService";
import { AuditMapper } from "../../Shared/mappers/audits/AuditMapper";
import { ServiceResult } from '../../Domain/types/service/ServiceResult';
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { AuditMessages } from "../../Domain/constants/messages/audits/AuditMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";

export class AuditService implements IAuditService {
    public constructor(private readonly auditRepo: IAuditRepository
  ) {}

  async getAll(dto : GetAuditsDto): Promise<ServiceResult<PaginatedListDto<AuditDto>>> {
    const result  = await this.auditRepo.findAll(dto);
    
    const data = new PaginatedListDto(
      result.audits.map((audit) => AuditMapper.toDto(audit)),
      result.total, 
      dto.page, 
      dto.limit
    );
    return ServiceResultFactory.ok(AuditMessages.fetchAllSuccess,data,HttpStatus.ok); 
  }

  async create(dto: CreateAuditDto): Promise<AuditDto | null> {
    const created = await this.auditRepo.create(dto);
    if (created.id === 0) return null;
    
    return AuditMapper.toDto(created);
  }

 
}
