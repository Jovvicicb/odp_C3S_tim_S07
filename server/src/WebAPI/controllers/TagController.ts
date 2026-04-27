import { Request, Response, Router } from "express";
import { ITagService } from "../../Domain/services/tags/ITagService";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";
import { TagLogMessages } from "../../Domain/constants/messages/tags/TagLogMessages";
import { TagMessages } from "../../Domain/constants/messages/tags/TagMessages";
import { validateCreateTag } from "../validators/tags/ValidateCreateTag";
import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { parseStringValue } from "../parser/common/ParseStringValue";
import { parseId } from "../parser/common/ParseId";
import { validateId } from "../validators/common/ValidateId";
import { IpHelper } from "../../Shared/helpers/IpHelper";

export class TagController {
  private readonly router = Router();

  public constructor(
    private readonly tagService: ITagService,
    private readonly logger: ILoggerService
  ) {
    this.router.post("/tags",       authenticate, authorize(UserRole.ADMIN), this.create.bind(this));
    this.router.delete("/tags/:id", authenticate, authorize(UserRole.ADMIN), this.delete.bind(this));

  }

  private async create(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.unauthorized).json({
          success: false,
          message: UserMessages.unauthorized,
        });
        return;
      }

    const { validation, dto } = validateCreateTag(req.body as { name?: string });

    if (!validation.valid || !dto) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: validation.message,
      });
      return;
    }

    const ctx = IpHelper.buildAuditContext(req,userId);
    try {
      const result = await this.tagService.create(dto, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, TagLogMessages.createFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: TagMessages.createFailed,
      });
    }
  }


  private async delete(req: Request, res: Response): Promise<void> {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.unauthorized).json({
          success: false,
          message: UserMessages.unauthorized,
        });
        return;
      }
  
      const idParam = parseStringValue(req.params.id);
      const id = parseId(idParam);
      const v = validateId(id);
  
      if (!v.valid) {
        res.status(HttpStatus.badRequest).json({ success: false, message: v.message });
        return;
      } 
  
      const ctx = IpHelper.buildAuditContext(req,userId);
      try{
        const result = await this.tagService.delete(id,ctx);
        ResponseHelper.send(res, result);
      }catch(err){
        this.logger.error(this.constructor.name, TagLogMessages.deleteFailed, err);
  
        res.status(HttpStatus.internalServerError).json({
          success: false,
          message: TagMessages.deleteFailed
        });
      }
    }

  public getRouter(): Router { return this.router; }
}
