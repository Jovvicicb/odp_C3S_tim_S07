import { RowDataPacket, ResultSetHeader } from "mysql2";
import { DbManager } from "../../connection/DbConnectionPool";
import { ICommentRepository } from "../../../Domain/repositories/comments/ICommentRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { CreateCommentDto } from "../../../Domain/DTOs/comments/CreateCommentDto";
import { Comment } from "../../../Domain/models/Comment";
import { CommentLogMessages } from "../../../Domain/constants/messages/comments/CommentLogMessages";
import { CommentMapper } from "../../../Shared/mappers/comments/CommentMpper";

const safeInt = (n: number): number => Math.max(0, Math.floor(n));

export class CommentRepository implements ICommentRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const res = await this.db.getWriteConnection();
    if (!res) return new Comment();

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO comments (content, user_id, post_id, parent_id)
         VALUES (?, ?, ?, ?)`,
        [
          dto.content,
          dto.userId,
          dto.postId,
          dto.parentId,
        ]
      );

      if (result.insertId === 0) return new Comment();

      return new Comment(
        result.insertId,
        dto.content,
        dto.userId,
        dto.postId,
        dto.parentId
      );
    } catch (err) {
      this.logger.error("CommentRepository", CommentLogMessages.createFailed, err);
      return new Comment();
    } finally {
      res.conn.release();
    }
  }


  async findById(id: number): Promise<Comment> {
    const res = await this.db.getReadConnection();
    if (!res) return new Comment();

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
         FROM comments
         WHERE id = ?
         LIMIT 1`,
        [id]
      );

      return rows.length > 0 ? CommentMapper.toModel(rows[0]) : new Comment();
    } catch (err) {
      this.logger.error("CommentRepository", CommentLogMessages.findByIdFailed, err);
      return new Comment();
    } finally {
      res.conn.release();
    }
  }
  
}
