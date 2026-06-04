export class AuditDisplayHelper {
  public static formatAction(action: string): string {
    return action
      .split("_")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  public static formatDate(value: string): string {
    if (!value) {
      return "Unknown time";
    }

    return new Date(value).toLocaleString();
  }

  public static actorLabel(userId: number | null): string {
    return userId === null ? "System" : `User #${userId}`;
  }
}