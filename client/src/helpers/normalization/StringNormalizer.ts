export class StringNormalizer {
  private static toString(value?: string | number | boolean | null): string {
    return typeof value === "string" ? value : "";
  }

  static trim(value?: string | number | boolean | null): string {
    return this.toString(value).trim();
  }

  static normalizeSpaces(value?: string | number | boolean | null): string {
    return this.toString(value).trim().replace(/\s+/g, " ");
  }

  static normalizeEmail(value?: string | number | boolean | null): string {
    return this.toString(value).trim().toLowerCase();
  }
}