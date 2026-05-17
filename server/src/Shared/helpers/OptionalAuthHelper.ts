import { Request } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../../Domain/enums/users/UserRole";

export type OptionalAuthUser = {id: number; username: string; role: UserRole;};

export class OptionalAuthHelper {
  public static getUser(req: Request): OptionalAuthUser | undefined {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return undefined;
    }

    const token = header.split(" ")[1];

    try {
      return jwt.verify(token, process.env.JWT_SECRET ?? "") as OptionalAuthUser;
    } catch {
      return undefined;
    }
  }
}