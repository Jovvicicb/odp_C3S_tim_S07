import { Request, Response, Router } from "express";

import { CommentLogMessages } from "../../Domain/constants/messages/comments/CommentLogMessages";
import { CommentMessages } from "../../Domain/constants/messages/comments/CommentMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { GetCommentsByPostDto } from "../../Domain/DTOs/comments/GetCommentsByPostDto";
import { GetCommentsByUserDto } from "../../Domain/DTOs/comments/GetCommentsByUserDto";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { ICommentLikeService } from "../../Domain/services/comments/ICommentLikeService";
import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";

import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

import { IpHelper } from "../../Shared/helpers/IpHelper";
import { OptionalAuthHelper } from "../../Shared/helpers/OptionalAuthHelper";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";

import { parseId } from "../parser/common/ParseId";
import { parsePagination } from "../parser/common/ParsePagination";
import { parseStringValue } from "../parser/common/ParseStringValue";
import { CreateCommentInput } from "../types/comments/CreateCommentInput";
import { UpdateCommentInput } from "../types/comments/UpdateCommentInput";
import { validateCommentSort } from "../validators/comments/ValidateCommentSort";
import { validateCreateComment } from "../validators/comments/ValidateCreateComment";
import { validateUpdateComment } from "../validators/comments/ValidateUpdateComment";
import { validateId } from "../validators/common/ValidateId";
import { validatePagination } from "../validators/common/ValidatePagination";

export class CommentController {
  private readonly router = Router();

  public constructor(
    private readonly commentService: ICommentService,
    private readonly commentLikeService: ICommentLikeService,
    private readonly logger: ILoggerService,
  ) {
    this.router.get("/comments/post/:postId",                                                                this.getByPost.bind(this));
    this.router.get("/comments/user/:userId",                                                                this.getByUser.bind(this));
    this.router.post("/comments",                    authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.create.bind(this));
    this.router.put("/comments/:id",                 authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.update.bind(this));
    this.router.delete("/comments/:id",              authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.delete.bind(this));
    this.router.post("/comments/:id/like",           authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.like.bind(this));
    this.router.delete("/comments/:id/like",         authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.unlike.bind(this));
    this.router.patch("/comments/:id/flag",          authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.flag.bind(this));
    this.router.patch("/comments/:id/unflag",        authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.unflag.bind(this));
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

    const sort = validateCommentSort(sortParam);
    
    const dto = new GetCommentsByPostDto(postId, page, limit, sort);

    const viewer = OptionalAuthHelper.getUser(req);

    try {
      const result = await this.commentService.getByPost(dto, viewer?.id, viewer?.role);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.fetchByPostFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.fetchByPostFailed,
      });
    }
  }


  private async getByUser(req: Request, res: Response): Promise<void> {
    const userIdParam = parseStringValue(req.params.userId);
    const pageParam = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);

    const userId = parseId(userIdParam);
    const { page, limit } = parsePagination(pageParam, limitParam);

    const userIdValidation = validateId(userId);
    if (!userIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: userIdValidation.message,
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

    const dto = new GetCommentsByUserDto(userId, page, limit);

    const viewer = OptionalAuthHelper.getUser(req);

    try {
      const result = await this.commentService.getByUser(dto, viewer?.id, viewer?.role);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.fetchByUserFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.fetchByUserFailed,
      });
    }
  }


  private async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

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

    const ctx = IpHelper.buildAuditContext(req, userId);

    try {
      const result = await this.commentService.create(dto, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.createFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.createFailed,
      });
    }
  }

  private async update(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

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
      this.logger.error(this.constructor.name, CommentLogMessages.updateFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.updateFailed,
      });
    }
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const userRole = req.user!.role;

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
      const result = await this.commentService.delete(id, ctx, userRole);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.deleteFailed, err instanceof Error ? err : null);
      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.deleteFailed,
      });
    }
  }

  private async like(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

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
      this.logger.error(this.constructor.name, CommentLogMessages.likeFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.likeFailed,
      });
    }
  }

  private async unlike(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

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
      this.logger.error(this.constructor.name, CommentLogMessages.unlikeFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.unlikeFailed,
      });
    }
  }

  private async flag(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const userRole = req.user!.role;

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
      const result = await this.commentService.flag(id, ctx, userRole);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.flagFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.flagFailed,
      });
    }
  }

  private async unflag(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const userRole = req.user!.role;

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
      const result = await this.commentService.unflag(id, ctx, userRole);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommentLogMessages.unflagFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommentMessages.unflagFailed,
      });
    }
  }

  public getRouter(): Router { return this.router; }
}
