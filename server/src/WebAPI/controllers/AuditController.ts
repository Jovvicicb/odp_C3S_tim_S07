import { Request, Response, Router } from "express";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { parseStringValue } from "../parser/common/ParseStringValue";
import { parsePagination } from "../parser/common/ParsePagination";
import { validatePagination } from "../validators/common/ValidatePagination";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { IAuditService } from "../../Domain/services/audits/IAuditService";
import { GetAuditsDto } from "../../Domain/DTOs/audits/GetAuditsDto";
import { AuditLogMessages } from "../../Domain/constants/messages/audits/AuditLogMessages";
import { AuditMessages } from "../../Domain/constants/messages/audits/AuditMessages";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";

export class AuditController {
  private readonly router = Router();

  public constructor(
    private readonly auditService: IAuditService,
    private readonly logger: ILoggerService
  ) {
    this.router.get("/audits/logs", authenticate, authorize(UserRole.ADMIN), this.getAll.bind(this));
    }

  private async getAll(req: Request, res: Response): Promise<void> {
    const pageParam   = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);
       
    const { page, limit } = parsePagination(pageParam, limitParam);
    
    const paginationValidation = validatePagination(page , limit);
    if (!paginationValidation.valid) {
      res.status(HttpStatus.badRequest).json({ success: false, message: paginationValidation.message });
      return;
    }

    const dto = new GetAuditsDto(page,limit);
    try{
      const result = await this.auditService.getAll(dto);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, AuditLogMessages.getAllFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: AuditMessages.fetchAllFailed,
      });
    }
  }

  public getRouter(): Router { return this.router; }
}
