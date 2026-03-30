import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../Domain/enums/UserRole";

export const authorize = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Forbidden" }); return;
    }
    next();
  };
