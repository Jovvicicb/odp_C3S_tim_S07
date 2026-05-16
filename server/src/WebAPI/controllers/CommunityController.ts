import { Request, Response, Router } from "express";
import { ICommunityService } from "../../Domain/services/community/ICommunityService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { upload } from "../../Middlewares/multer/multer";
import { validateCreateCommunity } from "../validators/community/ValidateCreateCommunity";
import { parseId } from "../parser/common/ParseId";
import { validateId } from "../validators/common/ValidateId";
import { parseStringValue } from "../parser/common/ParseStringValue";
import { parsePagination } from "../parser/common/ParsePagination";
import { validatePagination } from "../validators/common/ValidatePagination";
import { validateUpdateCommunity } from "../validators/community/ValidateUpdateCommunity";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CommunityMessages } from "../../Domain/constants/messages/community/CommunityMessages";
import { CreateCommunityInput } from "../types/community/CreateCommunityInput";
import { UpdateCommunityInput } from "../types/community/UpdateCommunityInput";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { CommunityLogMessages } from "../../Domain/constants/messages/community/CommunityLogMessages";
import { IpHelper } from "../../Shared/helpers/IpHelper";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";
import { ICommunityMemberService } from "../../Domain/services/community/ICommunityMemberService";
import { validateUpdateCommunityMemberRole } from "../validators/community/ValidateUpdateCommunityMemberRole";
import { validateUpdateCommunityMemberStatus } from "../validators/community/ValidateUpdateCommunityMemberStatus";
import { OptionalAuthHelper } from "../../Shared/helpers/OptionalAuthHelper";

export class CommunityController {
  private readonly router = Router();

  public constructor(
    private readonly communityService: ICommunityService,
    private readonly communityMemberService: ICommunityMemberService,
    private readonly logger: ILoggerService) {
    this.router.get("/communities",                                                                                                              this.getPublic.bind(this));
    this.router.get("/communities/mine",                         authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.getMine.bind(this));
    this.router.get("/communities/all",                          authenticate, authorize(UserRole.ADMIN),                                        this.getAll.bind(this));
    this.router.post("/communities",                             authenticate, authorize(UserRole.ADMIN, UserRole.USER), upload.single("image"), this.create.bind(this));
    this.router.get("/communities/:id",                                                                                                          this.getById.bind(this));
    this.router.put("/communities/:id",                          authenticate, authorize(UserRole.ADMIN, UserRole.USER), upload.single("image"), this.update.bind(this));
    this.router.delete("/communities/:id",                       authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.delete.bind(this));
    this.router.post("/communities/:id/join",                    authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.join.bind(this));
    this.router.delete("/communities/:id/leave",                 authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.leave.bind(this));
    this.router.patch("/communities/:id/members/:userId/role",   authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.updateMemberRole.bind(this));
    this.router.patch("/communities/:id/members/:userId/status", authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.updateMemberStatus.bind(this));
    this.router.delete("/communities/:id/members/:userId",       authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.removeMember.bind(this));
  }

  private async getPublic(req: Request, res: Response): Promise<void> {
    const pageParam   = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);
   
    const { page, limit } = parsePagination(pageParam, limitParam);
   
    const paginationValidation  = validatePagination(page, limit);
    if (!paginationValidation .valid) {
       res.status(HttpStatus.badRequest).json({ success: false, message: paginationValidation.message });
      return;
    } 

    const viewer = OptionalAuthHelper.getUser(req);
    try{
      const result = await this.communityService.getPublic(page, limit, viewer?.id);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, CommunityLogMessages.getPublicFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.fetchPublicFailed
      });

    }
  }


  private async getMine(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const pageParam   = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);
   
    const { page, limit } = parsePagination(pageParam, limitParam);
   
    const paginationValidation  = validatePagination(page, limit);
    if (!paginationValidation .valid) {
       res.status(HttpStatus.badRequest).json({ success: false, message: paginationValidation.message });
      return;
    } 

    try{
      const result = await this.communityMemberService.getMine(page, limit, userId);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, CommunityLogMessages.getMyCommunitiesFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.fetchMineFailed
      });

    }
  }

  private async getAll(req: Request, res: Response): Promise<void> {
    const pageParam   = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);
   
    const { page, limit } = parsePagination(pageParam, limitParam);
   
    const paginationValidation  = validatePagination(page, limit);
    if (!paginationValidation .valid) {
       res.status(HttpStatus.badRequest).json({ success: false, message: paginationValidation.message });
      return;
    } 

    const viewer = OptionalAuthHelper.getUser(req);
    try{
      const result = await this.communityService.getAll(page, limit, viewer?.id);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, CommunityLogMessages.getAllFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.fetchAllFailed
      });

    }
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const idParam = parseStringValue(req.params.id);
    const pageParam = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);

    const id = parseId(idParam);
    const { page, limit } = parsePagination(pageParam, limitParam);

    const idValidation = validateId(id);
    if (!idValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: idValidation.message,
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

    const viewer = OptionalAuthHelper.getUser(req);
    try {
      const result = await this.communityService.getById(page, limit, id, viewer?.id, viewer?.role);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommunityLogMessages.getByIdFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.fetchOneFailed,
      });
    }
  }


  private async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const { validation, dto } = validateCreateCommunity(
      {
        ...(req.body as CreateCommunityInput),
        ownerId: userId,
      },
      req.file
    );

    if (!validation.valid || !dto) {
      res.status(HttpStatus.badRequest).json({ success: false, message: validation.message });
      return;
    }

    const ctx = IpHelper.buildAuditContext(req,userId);
    try{
      const result = await this.communityService.create(dto,ctx);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, CommunityLogMessages.createFailed, err);
      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.createFailed
      });
    }
  }


  private async update(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const idParam = parseStringValue(req.params.id);
    const id = parseId(idParam);
    const v = validateId(id);

    if (!v.valid) {
       res.status(HttpStatus.badRequest).json({ success: false, message: v.message });
      return;
    } 
    const { validation, dto } = validateUpdateCommunity(
      req.body as UpdateCommunityInput,
      req.file
    );
    if (!validation.valid || !dto) {
        res.status(HttpStatus.badRequest).json({ success: false, message: validation.message });
        return;
      }

    const ctx = IpHelper.buildAuditContext(req,userId);
    try{
      const result = await this.communityService.update(id, dto, ctx);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name,CommunityLogMessages.updateFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.updateFailed
      });
    }
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const idParam = parseStringValue(req.params.id);
    const id = parseId(idParam);
    const v = validateId(id);

    if (!v.valid) {
      res.status(HttpStatus.badRequest).json({ success: false, message: v.message });
      return;
    } 

    const ctx = IpHelper.buildAuditContext(req,userId);
    try{
      const result = await this.communityService.delete(id,ctx);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, CommunityLogMessages.deleteFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.deleteFailed
      });
      
    }
  
  }

  private async join(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const idParam = parseStringValue(req.params.id);
    const communityId = parseId(idParam);

    const validation = validateId(communityId);
    if (!validation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: validation.message,
      });
      return;
    }

    try {
      const result = await this.communityMemberService.join(communityId, userId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommunityLogMessages.joinFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.joinFailed,
      });
    }
  }

  private async leave(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const idParam = parseStringValue(req.params.id);
    const communityId = parseId(idParam);

    const validation = validateId(communityId);
    if (!validation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: validation.message,
      });
      return;
    }

    try {
      const result = await this.communityMemberService.leave(communityId, userId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommunityLogMessages.leaveFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.leaveFailed,
      });
    }
  }



  private async updateMemberRole(req: Request, res: Response): Promise<void> {
    const requesterId = req.user!.id;

    const communityIdParam = parseStringValue(req.params.id);
    const communityId = parseId(communityIdParam);

    const communityIdValidation = validateId(communityId);
    if (!communityIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({success: false, message: communityIdValidation.message,});
      return;
    }

    const targetUserIdParam = parseStringValue(req.params.userId);
    const targetUserId = parseId(targetUserIdParam);

    const targetUserIdValidation = validateId(targetUserId);
    if (!targetUserIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({success: false, message: targetUserIdValidation.message,});
      return;
    }

    const { role } = req.body as { role?: string };

    const {validation, normalizedRole} = validateUpdateCommunityMemberRole(role);

    if (!validation.valid || !normalizedRole) {
      res.status(HttpStatus.badRequest).json({success: false, message: validation.message});
      return;
    }

    const ctx = IpHelper.buildAuditContext(req, requesterId);
    try {
      const result = await this.communityMemberService.updateMemberRole(communityId, targetUserId, normalizedRole, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommunityLogMessages.updateMemberRoleFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.updateMemberRoleFailed,
      });
    }
  }


  private async updateMemberStatus(req: Request, res: Response): Promise<void> {
    const requesterId = req.user!.id;

    const communityIdParam = parseStringValue(req.params.id);
    const communityId = parseId(communityIdParam);

    const communityIdValidation = validateId(communityId);
    if (!communityIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({success: false, message: communityIdValidation.message,});
      return;
    }

    const targetUserIdParam = parseStringValue(req.params.userId);
    const targetUserId = parseId(targetUserIdParam);

    const targetUserIdValidation = validateId(targetUserId);
    if (!targetUserIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({success: false, message: targetUserIdValidation.message,});
      return;
    }

    const { action } = req.body as { action?: string };

    const {validation, normalizedAction} = validateUpdateCommunityMemberStatus(action);

    if (!validation.valid || !normalizedAction) {
      res.status(HttpStatus.badRequest).json({success: false, message: validation.message});
      return;
    }

    const ctx = IpHelper.buildAuditContext(req, requesterId);
    try {
      const result = await this.communityMemberService.updateMemberStatus(communityId, targetUserId, normalizedAction, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommunityLogMessages.updateMemberStatusFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.updateMemberStatusFailed,
      });
    }
  }


  private async removeMember(req: Request, res: Response): Promise<void> {
    const requesterId = req.user!.id;

    const communityIdParam = parseStringValue(req.params.id);
    const communityId = parseId(communityIdParam);

    const communityIdValidation = validateId(communityId);
    if (!communityIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({success: false, message: communityIdValidation.message,});
      return;
    }

    const targetUserIdParam = parseStringValue(req.params.userId);
    const targetUserId = parseId(targetUserIdParam);

    const targetUserIdValidation = validateId(targetUserId);
    if (!targetUserIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({success: false, message: targetUserIdValidation.message,});
      return;
    }

    const ctx = IpHelper.buildAuditContext(req, requesterId);
    try {
      const result = await this.communityMemberService.removeMember(communityId, targetUserId, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, CommunityLogMessages.removeMemberFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.removeMemberFailed,
      });
    }
  }

  public getRouter(): Router { return this.router; }
}




