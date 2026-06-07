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

  public static isUnreachable(status: string): boolean {
    return this.normalize(status) === "unreachable";
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

    if (this.isUnreachable(status)) {
      return "red";
    }

    return "muted";
  }

  public static overallStatus(
    statuses: DbNodeStatus[],
  ): "healthy" | "warning" | "unreachable" {
    if (statuses.length === 0) {
      return "unreachable";
    }

    if (statuses.every((status) => this.isUnreachable(status))) {
      return "unreachable";
    }

    if (
      statuses.some((status) => this.isUnreachable(status)) ||
      statuses.some((status) => this.isDegraded(status))
    ) {
      return "warning";
    }

    return "healthy";
  }
}