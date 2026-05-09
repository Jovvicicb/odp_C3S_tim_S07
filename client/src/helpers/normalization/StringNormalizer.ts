export class StringNormalizer {
  static trim(value?: string | null): string {
    return value?.trim() ?? "";
  }

  static normalizeSpaces(value?: string | null): string {
    return value?.trim().replace(/\s+/g, " ") ?? "";
  }

  static normalizeEmail(value?: string | null): string {
    return value?.trim().toLowerCase() ?? "";
  }
}