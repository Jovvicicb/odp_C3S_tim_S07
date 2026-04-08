// TODO: Replace Entity with your domain resource name and adjust routes/roles accordingly
import { Request, Response, Router } from "express";
import { ICommunityService } from "../../Domain/services/community/ICommunityService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { CreateCommunityDto } from "../../Domain/DTOs/community/CreateCommunityDto";
import { upload } from "./multer";
import { CommunityType } from "../../Domain/enums/CommunityType";

export class CommunityController {
  private readonly router = Router();

  public constructor(private readonly communityService: ICommunityService) {
    this.router.get("/communities",          authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.getAll.bind(this));
    this.router.get("/communities/:id",      authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.getById.bind(this));
    this.router.get("/communities/user/:userId", authenticate, authorize(UserRole.ADMIN, UserRole.USER), this.getByOwnerId.bind(this));
    this.router.post("/communities",         authenticate, authorize(UserRole.USER), upload.single("image"), this.create.bind(this));
    this.router.patch("/communities/:id",    authenticate, authorize(UserRole.ADMIN), this.update.bind(this));
    this.router.delete("/communities/:id",   authenticate, authorize(UserRole.ADMIN), this.delete.bind(this));
  }

  private async getAll(req: Request, res: Response): Promise<void> {
    const page  = parseInt(String(req.query.page ?? "1"), 10);
    const limit = Math.min(parseInt(String(req.query.limit ?? "20"), 10), 100);
    const typeParam = req.query.type as string | undefined;
    const type = typeParam && Object.values(CommunityType).includes(typeParam as CommunityType) ? typeParam as CommunityType : undefined;
    const result = await this.communityService.getAll(page, limit,type);
    res.status(200).json({ success: true, data: result });
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ success: false, message: "Invalid id" }); return; }
    const entity = await this.communityService.getById(id);
    if (!entity) { res.status(404).json({ success: false, message: "Not found" }); return; }
    res.status(200).json({ success: true, data: entity });
  }

  private async getByOwnerId(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId as string, 10);
    const page  = parseInt(String(req.query.page ?? "1"), 10);
    const limit = Math.min(parseInt(String(req.query.limit ?? "20"), 10), 100);
    
    if (isNaN(userId)) { res.status(400).json({ success: false, message: "Invalid userId" }); return; }
    const items = await this.communityService.getByOwnerId(userId!,page,limit);
    res.status(200).json({ success: true, data: items });
  }

  private async create(req: Request, res: Response): Promise<void> {
    // TODO: Validate req.body and build CreateEntityDto from it

    const file = req.file;
    const avatar = file ? file.filename : "";

    const { name, description, rules, type } = req.body;

    const dto: CreateCommunityDto = {
      name,
      description,
      rules,
      type,
      ownerId: req.user!.id,
      avatar
    };

    
    const created = await this.communityService.create(dto);
    if (!created) { res.status(500).json({ success: false, message: "Failed to create" }); return; }
    res.status(201).json({ success: true, data: created });
  }

  private async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ success: false, message: "Invalid id" }); return; }
    const ok = await this.communityService.update(id, req.body);
    res.status(ok ? 200 : 500).json({ success: ok });
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ success: false, message: "Invalid id" }); return; }
    const ok = await this.communityService.delete(id);
    res.status(ok ? 200 : 500).json({ success: ok });
  }

  public getRouter(): Router { return this.router; }
}
