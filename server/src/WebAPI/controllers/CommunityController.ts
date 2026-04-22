import { Request, Response, Router } from "express";
import { ICommunityService } from "../../Domain/services/community/ICommunityService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { upload } from "../../Middlewares/multer/multer";
import { CommunityType } from "../../Domain/enums/CommunityType";
import { validateCreateCommunity } from "../validators/community/ValidateCreateCommunity";
import { GetCommunitiesDto } from "../../Domain/DTOs/community/GetCommunitiesDto";
import { GetCommunitiesByUserIdDto } from "../../Domain/DTOs/community/GetCommunitiesByUserIdDto";
import { validateGetAllCommunities } from "../validators/community/ValidateGetAllCommunities";
import { parseId } from "../parser/common/ParseId";
import { validateId } from "../validators/common/ValidateId";
import { parseStringValue } from "../parser/common/ParseStringValue";
import { parsePagination } from "../parser/common/ParsePagination";
import { validatePagination } from "../validators/common/ValidatePagination";
import { validateUpdateCommunity } from "../validators/community/ValidateUpdateCommunity";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CommunityMessages } from "../../Domain/constants/messages/community/CommunityMessages";
import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { CreateCommunityInput } from "../types/community/CreateCommunityInput";
import { UpdateCommunityInput } from "../types/community/UpdateCommunityInput";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { CommunityLogMessages } from "../../Domain/constants/messages/community/CommunityLogMessages";
import { IpHelper } from "../../Shared/helpers/IpHelper";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";

export class CommunityController {
  private readonly router = Router();

  public constructor(
    private readonly communityService: ICommunityService,
    private readonly logger: ILoggerService) {
    this.router.get("/communities",          authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.getAll.bind(this));
    this.router.get("/communities/user/:userId", authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.getByUserId.bind(this));
    this.router.get("/communities/:id",      authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.getById.bind(this));
    this.router.post("/communities",         authenticate, authorize(UserRole.USER), upload.single("image"), this.create.bind(this));
    this.router.patch("/communities/:id",    authenticate, authorize(UserRole.ADMIN),upload.single("image"), this.update.bind(this));
    this.router.delete("/communities/:id",   authenticate, authorize(UserRole.ADMIN), this.delete.bind(this));
  }

  private async getAll(req: Request, res: Response): Promise<void> {
    const pageParam   = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);
    const typeParam = (parseStringValue(req.query.type) ?? "").trim();
   
    const { page, limit } = parsePagination(pageParam, limitParam);
   
    const v = validateGetAllCommunities(page , limit, typeParam);
    if (!v.valid) {
      res.status(HttpStatus.badRequest).json({ success: false, message: v.message });
      return;
    }
    const type =typeParam === ""? undefined : (typeParam as CommunityType);

    const dto = new GetCommunitiesDto(page,limit,type);
    try{
      const result = await this.communityService.getAll(dto);
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
    const id = parseId(idParam);
    const v = validateId(id);

    if (!v.valid) {
       res.status(HttpStatus.badRequest).json({ success: false, message: v.message });
      return;
    } 
    try{
      const result = await this.communityService.getById(id);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, CommunityLogMessages.getByIdFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.fetchOneFailed
      });
    }
  }

  private async getByUserId(req: Request, res: Response): Promise<void> {
    const userIdParam = parseStringValue(req.params.userId);
    const pageParam   = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);

    const userId = parseId(userIdParam);
    const { page, limit } = parsePagination(pageParam, limitParam);

    const userValidation  = validateId(userId);
    if (!userValidation .valid) {
       res.status(HttpStatus.badRequest).json({ success: false, message: userValidation .message });
      return;
    } 
    const paginationValidation  = validatePagination(page,limit);
    if (!paginationValidation .valid) {
       res.status(HttpStatus.badRequest).json({ success: false, message: paginationValidation .message });
      return;
    } 
    const dto = new GetCommunitiesByUserIdDto(userId,page,limit);
    try{
    const result = await this.communityService.getByUserId(dto);
    ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, CommunityLogMessages.getByUserIdFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: CommunityMessages.fetchAllFailed
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
      const result = await this.communityService.update(id, dto,ctx);
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

  public getRouter(): Router { return this.router; }
}




