import type { DbNodeStatus } from "../../models/health/DbNodeHealthDto";

export class HealthStatusHelper {
  public static normalize(status: string): string {
    return status.trim().toLowerCase();
  }

  public static isHealthy(status: string): boolean {
    return this.normalize(status) === "healthy";
  }

  public static isDegraded(status: string): boolean {
    return this.normalize(status) === "degraded";
  }

  public static isOffline(status: string): boolean {
    return this.normalize(status) === "offline";
  }

  public static label(status: string): string {
    const normalized = this.normalize(status);

    if (!normalized) {
      return "Not available";
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  public static badgeTone(
    status: string,
  ): "emerald" | "amber" | "red" | "muted" {
    if (this.isHealthy(status)) {
      return "emerald";
    }

    if (this.isDegraded(status)) {
      return "amber";
    }

    if (this.isOffline(status)) {
      return "red";
    }

    return "muted";
  }

  public static overallStatus(
    statuses: DbNodeStatus[],
  ): "healthy" | "warning" | "offline" {
    if (statuses.length === 0) {
      return "offline";
    }

    if (statuses.every((status) => this.isOffline(status))) {
      return "offline";
    }

    if (
      statuses.some((status) => this.isOffline(status)) ||
      statuses.some((status) => this.isDegraded(status))
    ) {
      return "warning";
    }

    return "healthy";
  }
}