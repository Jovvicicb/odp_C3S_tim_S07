import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import { ValidationResult } from "../../Domain/types/ValidationResult";
import { validateLogin } from "../validators/auth/ValidateLogin";
import { validateRegister } from "../validators/auth/ValidateRegister";
import { upload} from "../../Middlewares/multer/multer"
import { StringNormalizer } from "../../Shared/normalization/StringNormalizer";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { AuthMessages } from "../../Domain/constants/messages/auth/AuthMessages";
import { RegisterInput } from "../types/auth/RegisterInput";

export class AuthController {
  private readonly router = Router();

  public constructor(private readonly authService: IAuthService) {
    this.router.post("/auth/login", this.login.bind(this));
    this.router.post(
        "/auth/register",
        upload.single("image"), 
        this.register.bind(this)
      );
        }

  private async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body as { username?: string; password?: string };
   
    const normalizedUserName =StringNormalizer.trim(username);
   
    const v: ValidationResult = validateLogin(normalizedUserName, password ?? "");

    if (!v.valid) { 
      res.status(HttpStatus.badRequest).json({ success: false, message: v.message }); 
      return; 
    }
    const result = await this.authService.login(normalizedUserName, password!);
    if (result.id === 0) {
       res.status(HttpStatus.unauthorized).json({
         success: false, 
         message: AuthMessages.invalidCredentials
        }); 
        return; 
      }
    const token = jwt.sign(
      { id: result.id, username: result.username, role: result.role },
      process.env.JWT_SECRET ?? "",
      { expiresIn: "24h" }
    );
    res.status(HttpStatus.ok).json({ success: true, message: AuthMessages.loginSuccess, data: token });
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
    const result = await this.authService.register(dto);
    if (result.id === 0) { 
      res.status(HttpStatus.conflict).json({
         success: false,
         message: AuthMessages.alreadyTaken 
      }); 
      return; 
    }
    const token = jwt.sign(
      { id: result.id, username: result.username, role: result.role },
      process.env.JWT_SECRET ?? "",
      { expiresIn: "24h" }
    );
    res.status(HttpStatus.created).json({ success: true, message: AuthMessages.registerSuccess, data: token });
  }

  public getRouter(): Router { return this.router; }
}
