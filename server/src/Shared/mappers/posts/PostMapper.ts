import { RowDataPacket } from "mysql2";
import { Post } from "../../../Domain/models/Post";
import { PostDto } from "../../../Domain/DTOs/Posts/PostDto";


export class PostMapper {
  public static toModel(row: RowDataPacket): Post {
    return new Post(
      row.id,
      row.title,
      row.content,
      row.media_url ?? null,
      row.author_id,
      row.community_id,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  public static toDto(community: Post): PostDto {
    return new PostDto(
      community.id,
      community.title,
      community.content,
      community.mediaUrl,
      community.authorId,
      community.communityId,
      community.createdAt,
      community.updatedAt
    );
  }

}