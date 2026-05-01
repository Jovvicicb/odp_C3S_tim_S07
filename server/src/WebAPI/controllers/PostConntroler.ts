import { Request, Response, Router } from "express";
import { IPostService } from "../../Domain/services/posts/IPostService";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { upload } from "../../Middlewares/multer/multer";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { CreatePostInput } from "../types/posts/CreatePostInput";
import { IpHelper } from "../../Shared/helpers/IpHelper";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";
import { PostLogMessages } from "../../Domain/constants/messages/posts/PostLogMessages";
import { PostMessages } from "../../Domain/constants/messages/posts/PostMessages";
import { validateCreatePost } from "../validators/posts/ValidateCreatePost";
import { parseStringValue } from "../parser/common/ParseStringValue";
import { parseId } from "../parser/common/ParseId";
import { validateId } from "../validators/common/ValidateId";
import { UpdatePostInput } from "../types/posts/UpdatePostInput";
import { validateUpdatePost } from "../validators/posts/ValidateUpdatePost";
import { validateAddTag } from "../validators/posts/ValidateAddTag";
import { IPostTagService } from "../../Domain/services/posts/IPostTagService";
import { IPostLikeService } from "../../Domain/services/posts/IPostLikeService";
import { parsePagination } from "../parser/common/ParsePagination";
import { validatePagination } from "../validators/common/ValidatePagination";
import { PostSortType } from "../../Domain/enums/posts/PostSortType";
import { GetPostsByCommunityDto } from "../../Domain/DTOs/Posts/GetPostsByCommunityDto";
import { OptionalAuthHelper } from "../../Shared/helpers/OptionalAuthHelper";
import { validatePostSort } from "../validators/posts/ValidatePostSort";

export class PostController {
  private readonly router = Router();

  public constructor(
    private readonly postService: IPostService,
    private readonly postTagService: IPostTagService,
    private readonly postLikeService: IPostLikeService,
    private readonly logger: ILoggerService) {
        this.router.get("/posts/community/:communityId",                                                                             this.getByCommunity.bind(this));
        this.router.post("/posts",                   authenticate, authorize(UserRole.ADMIN, UserRole.USER), upload.single("image"), this.create.bind(this));
        this.router.put("/posts/:id",                authenticate, authorize(UserRole.ADMIN, UserRole.USER), upload.single("image"), this.update.bind(this));
        this.router.delete("/posts/:id",             authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.delete.bind(this));
        this.router.post("/posts/:id/like",          authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.like.bind(this));
        this.router.delete("/posts/:id/like",        authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.unlike.bind(this));
        this.router.post("/posts/:id/tags",          authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.addTag.bind(this));
        this.router.delete("/posts/:id/tags/:tagId", authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.removeTag.bind(this));
    }



  private async getByCommunity(req: Request, res: Response): Promise<void> {
    const communityIdParam = parseStringValue(req.params.communityId);
    const pageParam = parseStringValue(req.query.page);
    const limitParam = parseStringValue(req.query.limit);
    const sortParam = parseStringValue(req.query.sort);

    const communityId = parseId(communityIdParam);
    const { page, limit } = parsePagination(pageParam, limitParam);

    const communityIdValidation = validateId(communityId);
    if (!communityIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: communityIdValidation.message,
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

    const sort = validatePostSort(sortParam);
    
    const dto = new GetPostsByCommunityDto(
      communityId,
      page,
      limit,
      sort
    );

    const viewer = OptionalAuthHelper.getUser(req);

    try {
      const result = await this.postService.getByCommunity(dto, viewer?.id, viewer?.role);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, PostLogMessages.findByCommunityFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: PostMessages.fetchByCommunityFailed,
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

    const { validation, dto } = validateCreatePost(
      {
        ...(req.body as CreatePostInput),
        authorId: userId,
      },
      req.file,
    );

    if (!validation.valid || !dto) {
      res.status(HttpStatus.badRequest).json({ success: false, message: validation.message });
      return;
    }

    const ctx = IpHelper.buildAuditContext(req,userId);
    try{
      const result = await this.postService.create(dto,ctx);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, PostLogMessages.createFailed, err);
      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: PostMessages.createFailed
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
      const result = await this.postService.delete(id,ctx);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, PostLogMessages.deleteFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: PostMessages.deleteFailed
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
    const { validation, dto } = validateUpdatePost(
      req.body as UpdatePostInput,
      req.file
    );
    if (!validation.valid || !dto) {
        res.status(HttpStatus.badRequest).json({ success: false, message: validation.message });
        return;
      }

    const ctx = IpHelper.buildAuditContext(req,userId);
    try{
      const result = await this.postService.update(id, dto, ctx);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name,PostLogMessages.updateFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: PostMessages.updateFailed
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

    const postIdParam = parseStringValue(req.params.id);
    const postId = parseId(postIdParam);
    
    const postIdValidation = validateId(postId);
    if (!postIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: postIdValidation.message
      });
      return;
    }
    
    try {
      const result = await this.postLikeService.like(userId,postId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, PostLogMessages.likeFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: PostMessages.likeFailed
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

    const postIdParam = parseStringValue(req.params.id);
    const postId = parseId(postIdParam);
    
    const postIdValidation = validateId(postId);
    if (!postIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: postIdValidation.message
      });
      return;
    }
    
    try {
      const result = await this.postLikeService.unlike(userId,postId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, PostLogMessages.unlikeFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: PostMessages.unlikeFailed
      });
    }
  }


  private async addTag(req: Request, res: Response): Promise<void> {
    const userId  = req.user?.id;
    if (!userId) {
      res.status(HttpStatus.unauthorized).json({success: false, message: UserMessages.unauthorized});
      return;
    }
  
    const postIdParam = parseStringValue(req.params.id);
    const postId = parseId(postIdParam);
  
    const postIdValidation = validateId(postId);
    if (!postIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({success: false, message: postIdValidation.message,});
      return;
    }
  
    const {validation, tagId} = validateAddTag(
      req.body as { tagId? : string}
    );
  
    if (!validation.valid || !tagId) {
      res.status(HttpStatus.badRequest).json({success: false, message: validation.message});
      return;
    }
  
    const ctx = IpHelper.buildAuditContext(req, userId);
    try {
      const result = await this.postTagService.addTag(postId, tagId, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, PostLogMessages.addTagFailed, err);
  
      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: PostMessages.addTagFailed,
      });
    }
  }


  private async removeTag(req: Request, res: Response): Promise<void> {
    const requesterId  = req.user?.id;
    if (!requesterId) {
      res.status(HttpStatus.unauthorized).json({success: false, message: UserMessages.unauthorized});
      return;
    }
  
    const postIdParam = parseStringValue(req.params.id);
    const postId = parseId(postIdParam);
  
    const postIdValidation = validateId(postId);
    if (!postIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({success: false, message: postIdValidation.message,});
      return;
    }
  
    const tagIdParam = parseStringValue(req.params.tagId);
    const tagId = parseId(tagIdParam);
  
    const tagIdValidation = validateId(tagId);
    if (!tagIdValidation.valid) {
      res.status(HttpStatus.badRequest).json({success: false, message: tagIdValidation.message,});
      return;
    }
  
    const ctx = IpHelper.buildAuditContext(req, requesterId);
    try {
      const result = await this.postTagService.removeTag(postId, tagId, ctx);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, PostLogMessages.removeTagFailed, err);
  
      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: PostMessages.removeTagFailed,
      });
    }
  }




  
  

  public getRouter(): Router { return this.router; }
}




