export class StringNormalizer {
  private static toString(value?: string | number | boolean | null): string {
    return typeof value === "string" ? value : "";
  }

  public static trim(value?: string | number | boolean | null): string {
    return this.toString(value).trim();
  }

  public static normalizeSpaces(value?: string | number | boolean | null): string {
    return this.toString(value).trim().replace(/\s+/g, " ");
  }

  public static normalizeEmail(value?: string | number | boolean | null): string {
    return this.toString(value).trim().toLowerCase().replace(/\s+/g, "");
  }
}