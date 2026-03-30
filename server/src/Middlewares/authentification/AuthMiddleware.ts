import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../Domain/types/JwtPayload";
import { UserRole } from "../../Domain/enums/UserRole";

declare global {
  namespace Express {
    interface Request { user?: JwtPayload; }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) { res.status(401).json({ success: false, message: "Missing token" }); return; }
  const token = header.slice(7);
  const decoded = (() => { try { return jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload; } catch { return null; } })();
  if (!decoded) { res.status(401).json({ success: false, message: "Invalid token" }); return; }
  req.user = { id: decoded.id, username: decoded.username, role: decoded.role as UserRole };
  next();
};
