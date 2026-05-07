import { Request, Response, Router } from "express";
import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { validateCreateComment } from "../validators/comments/ValidateCreateComment";
import { CreateCommentInput } from "../types/comments/CreateCommentInput";
import { IpHelper } from "../../Shared/helpers/IpHelper";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";
import { CommentLogMessages } from "../../Domain/constants/messages/comments/CommentLogMessages";
import { CommentMessages } from "../../Domain/constants/messages/comments/CommentMessages";
import { parseStringValue } from "../parser/common/ParseStringValue";
import { parseId } from "../parser/common/ParseId";
import { validateId } from "../validators/common/ValidateId";
import { validateUpdateComment } from "../validators/comments/ValidateUpdateComment";
import { UpdateCommentInput } from "../types/comments/UpdateCommentInput";
import { ICommentLikeService } from "../../Domain/services/comments/ICommentLikeService";
import { parsePagination } from "../parser/common/ParsePagination";
import { validatePagination } from "../validators/common/ValidatePagination";
import { CommentSortType } from "../../Domain/enums/comments/CommentSortType";
import { GetCommentsByPostDto } from "../../Domain/DTOs/comments/GetCommentsByPostDto";
import { OptionalAuthHelper } from "../../Shared/helpers/OptionalAuthHelper";

export class CommentController {
  private readonly router = Router();

  public constructor(
    private readonly commentService: ICommentService,
    private readonly commentLikeService: ICommentLikeService,
    private readonly logger: ILoggerService
    
  ) {
    this.router.get("/comments/post/:postId",                                                                this.getByPost.bind(this));
    this.router.post("/comments",                    authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.create.bind(this));
    this.router.put("/comments/:id",                 authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.update.bind(this));
    this.router.delete("/comments/:id",              authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.delete.bind(this));
    this.router.post("/comments/:id/like",           authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.like.bind(this));
    this.router.delete("/comments/:id/like",         authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.unlike.bind(this));

  }




  private async getByPost(req: Request, res: Response): Promise<void> {
    const postIdParam = parseStringValue(req.params.postId);
    const pageParam = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);
    const sortParam = parseStringValue(req.query.sort);

    const postId = parseId(postIdParam);
    const { page, limit } = parsePagination(pageParam, limitParam);

    const postIdValidation = validateId(postId);

    if (!postIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: postIdValidation.message,
      });
      return;
    }

    const paginationValidation = validatePagination(page, limit);

    if (!paginationValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: paginationValidation.message,
      });
      return;
    }

    const sort =
      sortParam === CommentSortType.POPULAR
        ? CommentSortType.POPULAR
        : CommentSortType.NEWEST;

    const dto = new GetCommentsByPostDto(
      postId,
      page,
      limit,
      sort
    );

    const viewer = OptionalAuthHelper.getUser(req);

    try {
      const result = await this.commentService.getByPost(
        dto,
        viewer?.id,
        viewer?.role
      );

      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.fetchByPostFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.fetchByPostFailed,
      });
    }
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

     const { validation, dto } = validateCreateComment({
      ...(req.body as CreateCommentInput),
      userId,
    });

    if (!validation.valid || !dto) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: validation.message,
      });
      return;
    }

    const ctx = IpHelper.buildAuditContext(req,userId);
    try {
      const result = await this.commentService.create(dto, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.createFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.createFailed,
      });
    }
  }

  private async update(req: Request, res: Response): Promise<void> {
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

    const idValidation = validateId(id);

    if (!idValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: idValidation.message,
      });
      return;
    }

    const { validation, dto } = validateUpdateComment(
      req.body as UpdateCommentInput
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
      const result = await this.commentService.update(id, dto, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.updateFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.updateFailed,
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

    const idValidation = validateId(id);

    if (!idValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: idValidation.message,
      });
      return;
    }

    const ctx = IpHelper.buildAuditContext(req, userId);

    try {
      const result = await this.commentService.delete(id, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.deleteFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.deleteFailed,
      });
    }
  }

  private async like(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      res.status(HttpStatus.unauthorized).json({
        success: false,
        message: UserMessages.unauthorized,
      });
      return;
    }

    const commentIdParam = parseStringValue(req.params.id);
    const commentId = parseId(commentIdParam);

    const commentIdValidation = validateId(commentId);

    if (!commentIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: commentIdValidation.message,
      });
      return;
    }

    try {
      const result = await this.commentLikeService.like(userId, commentId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.likeFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.likeFailed,
      });
    }
  }

  private async unlike(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      res.status(HttpStatus.unauthorized).json({
        success: false,
        message: UserMessages.unauthorized,
      });
      return;
    }

    const commentIdParam = parseStringValue(req.params.id);
    const commentId = parseId(commentIdParam);

    const commentIdValidation = validateId(commentId);

    if (!commentIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: commentIdValidation.message,
      });
      return;
    }

    try {
      const result = await this.commentLikeService.unlike(userId, commentId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.unlikeFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.unlikeFailed,
      });
    }
  }

  public getRouter(): Router { return this.router; }
}
