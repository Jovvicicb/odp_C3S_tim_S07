import { RowDataPacket } from "mysql2";
import { Post } from "../../../Domain/models/Post";
import { PostDto } from "../../../Domain/DTOs/posts/PostDto";
import { PostTagDto } from "../../../Domain/DTOs/tags/PostTagDto";
import { PostWithDetailsDto } from "../../../Domain/DTOs/posts/PostWithDetailsDto";
import { CommentTreeDto } from "../../../Domain/DTOs/comments/CommentTreeDto";
import { PostDetailsDto } from "../../../Domain/DTOs/posts/PostDetailsDto";
import { UserDto } from "../../../Domain/DTOs/users/UserDto";
import { CommunityDto } from "../../../Domain/DTOs/community/CommunityDto";
import { PostViewerPermissionsDto } from "../../../Domain/DTOs/posts/PostViewerPermissionsDto";
import { PaginatedListDto } from "../../../Domain/DTOs/common/PaginatedListDto";

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

  public static toWithDetailsDto(post: Post, authorUsername: string | null, communityName: string | null, tags: PostTagDto[], likeCount: number, commentCount: number): PostWithDetailsDto {
    return new PostWithDetailsDto(
      post.id,
      post.title,
      post.content,
      post.mediaUrl,
      post.authorId,
      authorUsername,
      post.communityId,
      communityName,
      post.createdAt,
      post.updatedAt,
      tags,
      likeCount,
      commentCount
    );
  }

public static toDetailsDto(
  post: Post,
  author: UserDto | null,
  community: CommunityDto,
  tags: PostTagDto[],
  likeCount: number,
  commentCount: number,
  likedByCurrentUser: boolean,
  permissions: PostViewerPermissionsDto,
  comments: PaginatedListDto<CommentTreeDto>
): PostDetailsDto {
  return new PostDetailsDto(
    post.id,
    post.title,
    post.content,
    post.mediaUrl,
    author,
    community,
    post.createdAt,
    post.updatedAt,
    tags,
    likeCount,
    commentCount,
    likedByCurrentUser,
    permissions,
    comments
  );
}
}