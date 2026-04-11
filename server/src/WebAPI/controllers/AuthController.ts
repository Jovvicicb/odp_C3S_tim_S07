import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import { ValidationResult } from "../../Domain/types/ValidationResult";
import { validateLogin } from "../validators/auth/validateLogin";
import { validateRegister } from "../validators/auth/validateRegister";
import { upload} from "../../Middlewares/multer/multer"

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
    const v: ValidationResult = validateLogin(username ?? "", password ?? "");
    if (!v.valid) { res.status(400).json({ success: false, message: v.message }); return; }
    const result = await this.authService.login(username!, password!);
    if (result.id === 0) { res.status(401).json({ success: false, message: "Invalid username or password" }); return; }
    const token = jwt.sign(
      { id: result.id, username: result.username, role: result.role },
      process.env.JWT_SECRET ?? "",
      { expiresIn: "24h" }
    );
    res.status(200).json({ success: true, message: "Login successful", data: token });
  }

  private async register(req: Request, res: Response): Promise<void> {
    const file = req.file;
    const image = file ? file.filename : "";
    const { username, email, password, role,fullname,bio } = req.body as { username?: string; email?: string; password?: string; role?: string; fullname?: string;bio?: string;  };
    const normalizedFullname = (fullname ?? "").trim().replace(/\s+/g, " ");
    const v: ValidationResult = validateRegister(username ?? "", email ?? "", password ?? "",normalizedFullname??"",bio??"",file);
    if (!v.valid) { res.status(400).json({ success: false, message: v.message }); return; }

    const result = await this.authService.register(username!, email!, role ?? "user", password!,normalizedFullname!,bio??"",image??"");
    if (result.id === 0) { res.status(409).json({ success: false, message: "Username or email already taken" }); return; }
    const token = jwt.sign(
      { id: result.id, username: result.username, role: result.role },
      process.env.JWT_SECRET ?? "",
      { expiresIn: "24h" }
    );
    res.status(201).json({ success: true, message: "Registration successful", data: token });
  }

  public getRouter(): Router { return this.router; }
}
