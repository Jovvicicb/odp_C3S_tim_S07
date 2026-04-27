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

export class TagController {
  private readonly router = Router();

  public constructor(
    private readonly tagService: ITagService,
    private readonly logger: ILoggerService
  ) {
    this.router.post("/tags", authenticate, authorize(UserRole.ADMIN), this.create.bind(this));
  }

  private async create(req: Request, res: Response): Promise<void> {
    const { validation, dto } = validateCreateTag(req.body as { name?: string });

    if (!validation.valid || !dto) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: validation.message,
      });
      return;
    }

    try {
      const result = await this.tagService.create(dto);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, TagLogMessages.createFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: TagMessages.createFailed,
      });
    }
  }

  public getRouter(): Router { return this.router; }
}
