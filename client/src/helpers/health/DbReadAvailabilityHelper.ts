import type { DbNodeHealthDto } from "../../models/health/DbNodeHealthDto";
import { HealthStatusHelper } from "./HealthStatusHelper";

export class DbReadAvailabilityHelper {
  public static canServeReads(node: DbNodeHealthDto): boolean {
    return node.canServeReads && !HealthStatusHelper.isUnreachable(node.status);
  }

  public static label(node: DbNodeHealthDto): string {
    if (node.role === "master") {
      return "Read fallback";
    }

    return this.canServeReads(node) ? "Read enabled" : "Standby";
  }

  public static description(node: DbNodeHealthDto): string {
    if (node.role === "master") {
      return "Used for writes and fallback reads";
    }

    return this.canServeReads(node)
      ? "Available for read distribution"
      : "Not used for reads until synchronized";
  }

  public static tone(node: DbNodeHealthDto): "emerald" | "amber" | "muted" {
    if (node.role === "master") {
      return "amber";
    }

    return this.canServeReads(node) ? "emerald" : "muted";
  }
}