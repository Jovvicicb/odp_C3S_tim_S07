import { RowDataPacket } from "mysql2";
import { CommentDto } from "../../../Domain/DTOs/comments/CommentDto";
import { Comment } from "../../../Domain/models/Comment";

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
}