import { RowDataPacket } from "mysql2";
import { CommentDto } from "../../../Domain/DTOs/comments/CommentDto";
import { Comment } from "../../../Domain/models/Comment";
import { CommentTreeDto } from "../../../Domain/DTOs/comments/CommentTreeDto";
import { CommentViewerPermissionsDto } from "../../../Domain/DTOs/comments/CommentViewerPermissionsDto";
import { Post } from "../../../Domain/models/Post";
import { Community } from "../../../Domain/models/Community";
import { UserProfileCommentDto } from "../../../Domain/DTOs/comments/UserProfileCommentDto";

export class CommentMapper {
  public static toModel(row: RowDataPacket): Comment {
    return new Comment(
      Number(row.id),
      String(row.content),
      Number(row.user_id),
      Number(row.post_id),
      row.parent_id === null ? null : Number(row.parent_id),
      Boolean(row.is_deleted),
      Boolean(row.is_flagged),
      new Date(row.created_at)
    );
  }

  public static toDto(comment: Comment): CommentDto {
    return new CommentDto(
      comment.id,
      comment.isDeleted ? "[komentar obrisan]" : comment.content,
      comment.userId,
      comment.postId,
      comment.parentId,
      comment.isDeleted,
      comment.isFlagged,
      comment.createdAt
    );
  }

  public static toTreeDto(comment: Comment, authorUsername: string | null, likeCount: number, likedByCurrentUser: boolean, permissions: CommentViewerPermissionsDto, replies: CommentTreeDto[] = []): CommentTreeDto {
    return new CommentTreeDto(
      comment.id,
      comment.isDeleted ? "[komentar obrisan]" : comment.content,
      comment.userId,
      authorUsername,
      comment.postId,
      comment.parentId,
      comment.isDeleted,
      comment.isFlagged,
      likeCount,
      likedByCurrentUser,
      permissions,
      comment.createdAt,
      replies
    );
  }


  public static toUserProfileDto(
    comment: Comment, 
    authorUsername: string | null, 
    post: Post | undefined,
    community: Community | undefined, 
    likeCount: number,
 ): UserProfileCommentDto {
    return new UserProfileCommentDto(
      comment.id,
      comment.content,
      comment.userId,
      authorUsername,
      comment.postId,
      post?.title ?? null,
      post?.communityId ?? 0,
      community?.name ?? null,
      comment.parentId,
      comment.isDeleted,
      comment.isFlagged,
      likeCount,
      comment.createdAt,
    );
  }

  public static toUserProfileDtos(
    comments: Comment[],
    usernameByUserId: Record<number, string>,
    postById: Record<number, Post>,
    communityById: Record<number, Community>,
    likeCountsByCommentId: Record<number, number>,
  ): UserProfileCommentDto[] {
    return comments.map((comment) => {
      const post = postById[comment.postId];
      const community = post ? communityById[post.communityId] : undefined;

      return this.toUserProfileDto(
        comment,
        usernameByUserId[comment.userId] ?? null,
        post,
        community,
        likeCountsByCommentId[comment.id] ?? 0,
      );
    });
  }
}