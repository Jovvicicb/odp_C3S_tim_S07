import { RowDataPacket } from "mysql2";
import { Post } from "../../../Domain/models/Post";
import { PostDto } from "../../../Domain/DTOs/Posts/PostDto";
import { PostTagDto } from "../../../Domain/DTOs/tags/PostTagDto";
import { PostWithDetailsDto } from "../../../Domain/DTOs/Posts/PostWithDetailsDto";
import { CommentTreeDto } from "../../../Domain/DTOs/comments/CommentTreeDto";
import { PostDetailsDto } from "../../../Domain/DTOs/Posts/PostDetailsDto";

export class PostMapper {
  public static toModel(row: RowDataPacket): Post {
    return new Post(
      Number(row.id),
      String(row.title),
      String(row.content),
      row.media_url === null ? null : String(row.media_url),
      Number(row.author_id),
      Number(row.community_id),
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  public static toDto(post: Post): PostDto {
    return new PostDto(
      post.id,
      post.title,
      post.content,
      post.mediaUrl,
      post.authorId,
      post.communityId,
      post.createdAt,
      post.updatedAt
    );
  }

  public static toWithDetailsDto(post: Post, tags: PostTagDto[], likeCount: number, commentCount: number): PostWithDetailsDto {
    return new PostWithDetailsDto(
      post.id,
      post.title,
      post.content,
      post.mediaUrl,
      post.authorId,
      post.communityId,
      post.createdAt,
      post.updatedAt,
      tags,
      likeCount,
      commentCount
    );
  }

  public static toDetailsDto(post: Post, tags: PostTagDto[], likeCount: number, commentCount: number, comments: CommentTreeDto[]): PostDetailsDto {
    return new PostDetailsDto(
      post.id,
      post.title,
      post.content,
      post.mediaUrl,
      post.authorId,
      post.communityId,
      post.createdAt,
      post.updatedAt,
      tags,
      likeCount,
      commentCount,
      comments
    );
  }

}