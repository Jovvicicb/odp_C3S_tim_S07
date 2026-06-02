export class ServerHealthHelper {
  public static formatUptime(seconds: number): string {
    const safeSeconds = Math.max(0, Math.floor(seconds));

    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }

    return `${remainingSeconds}s`;
  }

  public static formatTimestamp(timestamp: string): string {
    if (!timestamp) {
      return "Not checked yet";
    }

    return new Date(timestamp).toLocaleString();
  }

  public static isHealthy(status: string): boolean {
    return status.trim().toLowerCase() === "healthy";
  }
}