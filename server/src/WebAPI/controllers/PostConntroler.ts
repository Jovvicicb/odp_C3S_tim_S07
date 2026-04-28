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

export class PostController {
  private readonly router = Router();

  public constructor(
    private readonly postService: IPostService,
    private readonly logger: ILoggerService) {
        this.router.post("/posts",     authenticate, authorize(UserRole.ADMIN, UserRole.USER), upload.single("image"), this.create.bind(this));
        this.router.delete("/posts/:id", authenticate, authorize(UserRole.ADMIN, UserRole.USER),                         this.delete.bind(this));

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



  public getRouter(): Router { return this.router; }
}




