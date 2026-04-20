import { Request } from "express";
import { AuditContext } from "../../Domain/types/audits/AuditContext";

export class IpHelper {
  public static getRawIp(req: Request): string {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      ""
    );
  }

  public static normalize(ip: string): string {
    if (!ip) return "";

    // IPv4 mapped IPv6
    if (ip.startsWith("::ffff:")) {
      return ip.replace("::ffff:", "");
    }

    // localhost IPv6
    if (ip === "::1") {
      return "127.0.0.1";
    }

    return ip;
  }

  public static getClientIp(req: Request): string {
    return this.normalize(this.getRawIp(req));
  }

  public static buildAuditContext(req: Request, userId = 0): AuditContext {
    return {
      userId,
      ipAddress: this.getClientIp(req),
    };
  }
}