import { Request, Response, Router } from "express";

import { TagLogMessages } from "../../Domain/constants/messages/tags/TagLogMessages";
import { TagMessages } from "../../Domain/constants/messages/tags/TagMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { ITagService } from "../../Domain/services/tags/ITagService";

import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

import { IpHelper } from "../../Shared/helpers/IpHelper";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";

import { parseId } from "../parser/common/ParseId";
import { parsePagination } from "../parser/common/ParsePagination";
import { parseStringValue } from "../parser/common/ParseStringValue";
import { validateId } from "../validators/common/ValidateId";
import { validatePagination } from "../validators/common/ValidatePagination";
import { validateCreateTag } from "../validators/tags/ValidateCreateTag";

export class TagController {
  private readonly router = Router();

  public constructor(
    private readonly tagService: ITagService,
    private readonly logger: ILoggerService,
  ) {
    this.router.get("/tags",                                                 this.getAll.bind(this));
    this.router.post("/tags",       authenticate, authorize(UserRole.ADMIN), this.create.bind(this));
    this.router.delete("/tags/:id", authenticate, authorize(UserRole.ADMIN), this.delete.bind(this));
  }

  private async getAll(req: Request, res: Response): Promise<void> {
    const pageParam = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);

    const { page, limit } = parsePagination(pageParam, limitParam);

    const paginationValidation = validatePagination(page, limit);
    if (!paginationValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: paginationValidation.message,
      });
      return;
    }

    try {
      const result = await this.tagService.getAll(page, limit);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, TagLogMessages.findAllFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: TagMessages.fetchAllFailed,
      });
    }
  }

  private async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const { validation, dto } = validateCreateTag(
      req.body as { name?: string }
    );

    if (!validation.valid || !dto) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: validation.message,
      });
      return;
    }

    const ctx = IpHelper.buildAuditContext(req, userId);

    try {
      const result = await this.tagService.create(dto, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, TagLogMessages.createFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: TagMessages.createFailed,
      });
    }
  }


  private async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const idParam = parseStringValue(req.params.id);
    const id = parseId(idParam);
    const idValidation = validateId(id);

    if (!idValidation.valid) {
      res.status(HttpStatus.badRequest).json({ success: false, message: idValidation.message });
      return;
    } 

    const ctx = IpHelper.buildAuditContext(req, userId);

    try{
      const result = await this.tagService.delete(id, ctx);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, TagLogMessages.deleteFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: TagMessages.deleteFailed
      });
    }
  }

  public getRouter(): Router { return this.router; }
}
