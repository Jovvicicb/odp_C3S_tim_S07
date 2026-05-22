import { IAuditService } from "../../Domain/services/audits/IAuditService";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { IAuditHelperService } from '../../Domain/services/common/IAuditHelperService';

export class AuditHelperService implements IAuditHelperService {
  constructor(
    private readonly auditService: IAuditService,
    private readonly logger: ILoggerService
  ) {}

  async safeCreate(dto: CreateAuditDto): Promise<void> {
    try {
      const audit = await this.auditService.create(dto);

      if (!audit) {
        this.logger.warn("AuditHelper", "Audit not saved");
      }

    } catch (err) {
      this.logger.error("AuditHelper", "Audit failed", err instanceof Error ? err : null);
    }
  }
}