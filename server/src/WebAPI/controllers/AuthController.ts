import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import { validateLogin } from "../validators/auth/ValidateLogin";
import { validateRegister } from "../validators/auth/ValidateRegister";
import { upload } from "../../Middlewares/multer/multer"
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { AuthMessages } from "../../Domain/constants/messages/auth/AuthMessages";
import { RegisterInput } from "../types/auth/RegisterInput";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { AuthLogMessages } from "../../Domain/constants/messages/auth/AuthLogMessages";
import { IpHelper } from "../../Shared/helpers/IpHelper";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";

export class AuthController {
  private readonly router = Router();

  public constructor(private readonly authService: IAuthService,
    private readonly logger: ILoggerService
  ) {
    this.router.post("/auth/register", upload.single("image"),                              this.register.bind(this));
    this.router.post("/auth/login",                                                         this.login.bind(this));
    this.router.post("/auth/logout", authenticate, authorize(UserRole.USER,UserRole.ADMIN), this.logout.bind(this));
    }

  private async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body as { username?: string; password?: string };
   
    const {validation, validUserName, validPassword} = validateLogin(username, password);
 
    if (!validation.valid || !validUserName || !validPassword) { 
      res.status(HttpStatus.badRequest).json({ 
        success: false,
        message: validation.message 
      }); 
      return; 
    }
    const ctx = IpHelper.buildAuditContext(req);
    try{
      const result = await this.authService.login(validUserName, validPassword,ctx);
      
      if (!result.success || !result.data) {
        ResponseHelper.send(res, result);
        return;
      }

      const token = jwt.sign(
        { id: result.data.id, username: result.data.username, role: result.data.role },
        process.env.JWT_SECRET ?? "",
        { expiresIn: "24h" }
      );

      res.status(result.status).json({
          success: result.success,  message: result.message, data: token 
        }
      );
    }catch(err){
      this.logger.error(this.constructor.name, AuthLogMessages.loginFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: AuthMessages.loginFailed
      });
    }
  
  }

  private async register(req: Request, res: Response): Promise<void> {
    const { validation, dto } = validateRegister(
      req.body as RegisterInput,
      req.file
    );

    if (!validation.valid || !dto) {
      res.status(HttpStatus.badRequest).json({
        success: false,
        message: validation.message,
      });
      return;
    }
    const ctx = IpHelper.buildAuditContext(req);
    try{
      const result = await this.authService.register(dto,ctx);
      if (!result.success || !result.data) {
        ResponseHelper.send(res, result);
        return;
      }

      const token = jwt.sign(
        { id: result.data.id, username: result.data.username, role: result.data.role },
        process.env.JWT_SECRET ?? "",
        { expiresIn: "24h" }
      );

      res.status(result.status).json({ 
        success: result.success, 
        message: result.message, 
        data: token 
      });
   }catch(err){
      this.logger.error(this.constructor.name, AuthLogMessages.registerFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: AuthMessages.registerFailed,
      });
   }
  }
  
  private async logout(req: Request, res: Response): Promise<void> {
    const ctx = IpHelper.buildAuditContext(req,req.user!.id);
    try{
      const result =  await this.authService.logout(ctx);
      ResponseHelper.send(res, result);
    }catch(err){
      this.logger.error(this.constructor.name, AuthLogMessages.logoutFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: AuthMessages.logoutFailed
      });
      
    }
  }

  public getRouter(): Router { return this.router; }
}
