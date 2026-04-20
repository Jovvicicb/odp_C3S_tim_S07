import { Request, Response, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
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

export class UserController {
  private readonly router = Router();

  public constructor(private readonly userService: IUserService,
     private readonly logger: ILoggerService
  ) {
    this.router.get("/users", authenticate, authorize(UserRole.ADMIN), this.getAll.bind(this));
    this.router.get("/users/:id", authenticate, authorize(UserRole.ADMIN), this.getById.bind(this));
    this.router.patch("/users/:id/deactivate", authenticate, authorize(UserRole.ADMIN), this.deactivate.bind(this));
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
      const users = await this.userService.getAll(dto);
      res.status(HttpStatus.ok).json({ 
        success: true, 
        data: users 
      });
    }catch(err){
      this.logger.error(this.constructor.name, UserLogMessages.getAllFailed, err);

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
      const user = await this.userService.getById(id);
      if (!user) {
      res.status(HttpStatus.notFound).json({
        success: false, 
        message: UserMessages.notFound
        });
      return; 
      }
      res.status(HttpStatus.ok).json({ 
        success: true, 
        data: user
      });
    }catch(err){
      this.logger.error(this.constructor.name, UserLogMessages.getByIdFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.fetchOneFailed,
      });
    }
  }

  private async deactivate(req: Request, res: Response): Promise<void> {
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
      const existing = await this.userService.getById(id);

      if (!existing) {
        res.status(HttpStatus.notFound).json({
          success: false,
          message: UserMessages.notFound,
        });
        return;
      }

      const ok = await this.userService.deactivate(id);
      if (!ok) {
        res.status(HttpStatus.internalServerError).json({ 
          success: false, 
          message: UserMessages.deactivateFailed
        });
        return;
      }
      
      res.status(HttpStatus.ok).json({
        success: true,
        message: UserMessages.deactivated 
        });
    }catch(err){
       this.logger.error(this.constructor.name, UserLogMessages.deactivateFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: UserMessages.deactivateFailed,
      });
    }
  }

  public getRouter(): Router { return this.router; }
}
