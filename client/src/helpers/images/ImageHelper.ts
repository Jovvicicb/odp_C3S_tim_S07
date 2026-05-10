const API_URL = import.meta.env.VITE_API_URL;

export class ImageHelper {
  static getImageUrl(imageName?: string | null): string | null {
    if (!imageName) {
      return null;
    }

    const baseUrl = API_URL.replace(/\/api\/v1\/?$/, "");

    return `${baseUrl}/uploads/${imageName}`;
  }
}