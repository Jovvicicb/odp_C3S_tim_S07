import { Request, Response, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { parseStringValue } from "../parser/common/ParseStringValue";
import { parseId } from "../parser/common/ParseId";
import { validateId } from "../validators/common/ValidateId";
import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { parsePagination } from "../parser/common/ParsePagination";
import { validatePagination } from "../validators/common/ValidatePagination";
import { GetUsersDto } from "../../Domain/DTOs/users/GetUsersDto";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { UserLogMessages } from "../../Domain/constants/messages/user/UserLogMessages";
import { validateUsername } from "../validators/users/ValidateUsername";
import { UpdateMeInput } from "../types/users/UpdateMeInput";
import { validateUpdateMe } from "../validators/users/ValidateUpdateMe";
import { IpHelper } from "../../Shared/helpers/IpHelper";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";
import { upload } from "../../Middlewares/multer/multer";
import { validateUpdateUserRole } from "../validators/users/ValidateUpdateUserRole";
import { IUserFollowService } from "../../Domain/services/users/IUserFollowService";
import { GetFollowersDto } from "../../Domain/DTOs/users/GetFollowersDto";
import { GetFollowingDto } from "../../Domain/DTOs/users/GetFollowingDto";
import { UserValidationMessages } from "../../Domain/constants/messages/user/UserValidationMessages";
import { StringNormalizer } from "../../Shared/normalization/StringNormalizer";

export class UserController {
  private readonly router = Router();

  public constructor(
    private readonly userService: IUserService,
    private readonly userFollowService: IUserFollowService,
    private readonly logger: ILoggerService
  ) {
    this.router.get("/users/search",           authenticate, authorize(UserRole.USER,UserRole.ADMIN),                         this.search.bind(this));
    this.router.get("/users/all",              authenticate, authorize(UserRole.ADMIN),                                       this.getAll.bind(this));
    this.router.get("/users/:id",                                                                                             this.getById.bind(this));
    this.router.put("/users/me",               authenticate, authorize(UserRole.USER,UserRole.ADMIN), upload.single("image"), this.updateMe.bind(this));
    this.router.get("/users/:id/followers",                                                                                   this.getFollowers.bind(this));
    this.router.get("/users/:id/following",                                                                                   this.getFollowing.bind(this));
    this.router.post("/users/:id/follow",      authenticate, authorize(UserRole.USER,UserRole.ADMIN),                         this.follow.bind(this));
    this.router.delete("/users/:id/follow",    authenticate, authorize(UserRole.USER,UserRole.ADMIN),                         this.unfollow.bind(this));
    this.router.delete("/users/:id/follower",  authenticate, authorize(UserRole.USER, UserRole.ADMIN),                        this.removeFollower.bind(this));
    this.router.put("/users/:id/role",         authenticate, authorize(UserRole.ADMIN),                                       this.updateRole.bind(this));
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

    const dto = new GetUsersDto(page,limit);
    try{
      const result = await this.userService.getAll(dto);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, UserLogMessages.getAllFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.fetchAllFailed,
      });
    }
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const idParam = parseStringValue(req.params.id);
    const id = parseId(idParam);
    const v = validateId(id);
  
    if (!v.valid) {
       res.status(HttpStatus.badRequest).json({
         success: false, 
         message: v.message 
        });
       return;
    } 

    try{
      const result = await this.userService.getById(id);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, UserLogMessages.getByIdFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.fetchOneFailed,
      });
    }
  }


  private async search(req: Request, res: Response): Promise<void> {
    const viewerId = req.user!.id;

    const usernameParam = parseStringValue(req.query.username);
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

    const username = StringNormalizer.trim(usernameParam);

    if (!username) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: UserValidationMessages.usernameRequired,
      });
      return;
    }
    
    try{
      const result = await this.userService.search(username ,page , limit, viewerId);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, UserLogMessages.getByUsernameFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.fetchOneFailed,
      });
    }
  }

  private async updateMe(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const { validation, dto } = validateUpdateMe(
      req.body as UpdateMeInput,
      req.file
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
      const result = await this.userService.update(dto, ctx);
      ResponseHelper.send(res,result);
    } catch (err) {
      this.logger.error(this.constructor.name, UserLogMessages.updateFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.updateFailed,
      });
    }
  }

  private async updateRole(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const idParam = parseStringValue(req.params.id);
    const id = parseId(idParam);
    
    const idValidation = validateId(id);
    if (!idValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: idValidation.message
      });
      return;
    }

    const { role } = req.body as { role?: string };
    const parsedRole = parseStringValue(role);

    const {validation, normalizedRole} = validateUpdateUserRole(parsedRole);
    
    if (!validation.valid || !normalizedRole) {
      res.status(HttpStatus.badRequest).json({success: false, message: validation.message});
      return;
    }
    
    const ctx = IpHelper.buildAuditContext(req, userId);
    try {
      const result = await this.userService.updateRole(id, normalizedRole, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, UserLogMessages.updateRoleFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.roleUpdateFailed
      });
    }
  }

  private async follow(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const idParam = parseStringValue(req.params.id);
    const targetUserId = parseId(idParam);
    
    const idValidation = validateId(targetUserId);
    if (!idValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: idValidation.message
      });
      return;
    }
    
    try {
      const result = await this.userFollowService.follow(targetUserId,userId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, UserLogMessages.followFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.followFailed
      });
    }
  }

  private async unfollow(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const idParam = parseStringValue(req.params.id);
    const targetUserId = parseId(idParam);
    
    const idValidation = validateId(targetUserId);
    if (!idValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: idValidation.message
      });
      return;
    }
    
    try {
      const result = await this.userFollowService.unfollow(targetUserId,userId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, UserLogMessages.unfollowFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.unfollowFailed
      });
    }
  }

  private async removeFollower(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const idParam = parseStringValue(req.params.id);
    const followerId = parseId(idParam);

    const idValidation = validateId(followerId);
    if (!idValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: idValidation.message,
      });
      return;
    }

    try {
      const result = await this.userFollowService.removeFollower(followerId, userId);

      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, UserLogMessages.removeFollowerFailed,err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.removeFollowerFailed,
      });
    }
  }

  private async getFollowers(req: Request, res: Response): Promise<void> {
      const idParam = parseStringValue(req.params.id);
      const pageParam  = parseStringValue(req.query.page);
      const limitParam = parseStringValue(req.query.limit);

      const id = parseId(idParam);
      const { page, limit } = parsePagination(pageParam, limitParam);

      const idValidation  = validateId(id);
      if (!idValidation .valid) {
        res.status(HttpStatus.badRequest).json({ success: false, message: idValidation.message });
        return;
      } 
      const paginationValidation  = validatePagination(page,limit);
      if (!paginationValidation .valid) {
        res.status(HttpStatus.badRequest).json({ success: false, message: paginationValidation .message });
        return;
      } 
      const dto = new GetFollowersDto(id,page,limit);
      try{
        const result = await this.userFollowService.getFollowers(dto);
        ResponseHelper.send(res, result);
      }catch(err){
        this.logger.error(this.constructor.name, UserLogMessages.getFollowersFailed, err instanceof Error ? err : null);

        res.status(HttpStatus.internalServerError).json({
          success: false,
          message: UserMessages.followersFetchFailed
        });
      }
  }

  private async getFollowing(req: Request, res: Response): Promise<void> {
      const idParam = parseStringValue(req.params.id);
      const pageParam  = parseStringValue(req.query.page);
      const limitParam = parseStringValue(req.query.limit);

      const id = parseId(idParam);
      const { page, limit } = parsePagination(pageParam, limitParam);

      const idValidation  = validateId(id);
      if (!idValidation .valid) {
        res.status(HttpStatus.badRequest).json({ success: false, message: idValidation.message });
        return;
      } 
      const paginationValidation  = validatePagination(page,limit);
      if (!paginationValidation .valid) {
        res.status(HttpStatus.badRequest).json({ success: false, message: paginationValidation .message });
        return;
      } 
      const dto = new GetFollowingDto(id,page,limit);
      try{
        const result = await this.userFollowService.getFollowing(dto);
        ResponseHelper.send(res, result);
      }catch(err){
        this.logger.error(this.constructor.name, UserLogMessages.getFollowingFailed, err instanceof Error ? err : null);

        res.status(HttpStatus.internalServerError).json({
          success: false,
          message: UserMessages.followingFetchFailed
        });
      }
  }


  public getRouter(): Router { return this.router; }
}
