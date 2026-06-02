import type { DbNodeRole } from "../../models/health/DbNodeHealthDto";

export class DbNodeRoleHelper {
  public static isMaster(role: DbNodeRole): boolean {
    return role === "master";
  }

  public static label(role: DbNodeRole): string {
    return role === "master" ? "Master" : "Slave";
  }

  public static description(role: DbNodeRole): string {
    return role === "master" ? "Write node" : "Read replica";
  }

  public static tone(role: DbNodeRole): "sky" | "amber" | "muted" {
    return role === "master" ? "amber" : "sky";
  }
}