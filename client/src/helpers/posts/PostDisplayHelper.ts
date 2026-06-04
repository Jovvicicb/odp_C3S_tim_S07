import type { PostWithDetailsDto } from "../../models/posts/PostWithDetailsDto";

export class PostDisplayHelper {
  public static formatDate(value: string | null): string {
    if (!value) {
      return "Unknown";
    }

    return new Date(value).toLocaleString();
  }

  public static authorLabel(post: PostWithDetailsDto): string {
    return post.authorUsername ?? `User #${post.authorId}`;
  }

  public static communityLabel(post: PostWithDetailsDto): string {
    return post.communityName ?? `Community #${post.communityId}`;
  }

  public static tagsLabel(post: PostWithDetailsDto): string {
    if (post.tags.length === 0) {
      return "No tags";
    }

    return post.tags.map((tag) => `#${tag.name}`).join(", ");
  }

  public static shortContent(content: string, maxLength = 120): string {
    const normalized = content.trim();

    if (normalized.length <= maxLength) {
      return normalized;
    }

    return `${normalized.slice(0, maxLength)}...`;
  }
}