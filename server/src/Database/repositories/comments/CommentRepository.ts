import { RowDataPacket, ResultSetHeader } from "mysql2";
import { DbManager } from "../../connection/DbConnectionPool";
import { ICommentRepository } from "../../../Domain/repositories/comments/ICommentRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { CreateCommentDto } from "../../../Domain/DTOs/comments/CreateCommentDto";
import { Comment } from "../../../Domain/models/Comment";
import { CommentLogMessages } from "../../../Domain/constants/messages/comments/CommentLogMessages";
import { CommentMapper } from "../../../Shared/mappers/comments/CommentMapper";
import { UpdateCommentDto } from "../../../Domain/DTOs/comments/UpdateCommentDto";
import { GetCommentsByPostDto } from "../../../Domain/DTOs/comments/GetCommentsByPostDto";
import { CommentSortType } from "../../../Domain/enums/comments/CommentSortType";

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
      this.logger.error("CommentRepository", CommentLogMessages.createFailed, err instanceof Error ? err : null);
      return new Comment();
    } finally {
      res.conn.release();
    }
  }

  async update(id: number, dto: UpdateCommentDto): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE comments
        SET content = ?
        WHERE id = ?`,
        [dto.content, id]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommentRepository", CommentLogMessages.updateFailed, err instanceof Error ? err : null);
      return false;
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
      this.logger.error("CommentRepository", CommentLogMessages.findByIdFailed, err instanceof Error ? err : null);
      return new Comment();
    } finally {
      res.conn.release();
    }
  }

  async softDelete(id: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE comments
        SET is_deleted = 1
        WHERE id = ?`,
        [id]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommentRepository", CommentLogMessages.softDeleteFailed, err instanceof Error ? err : null);
      return false;
    } finally {
      res.conn.release();
    }
  }

  async findRootByPost(dto: GetCommentsByPostDto): Promise<{ comments: Comment[]; total: number }> {
    const res = await this.db.getReadConnection();
    if (!res) return { comments: [], total: 0 };

    const offset = safeInt((dto.page - 1) * dto.limit);
    const lim = safeInt(dto.limit);

    const orderByMap: Record<CommentSortType, string> = {
      [CommentSortType.NEWEST]: "comments.created_at DESC",

      [CommentSortType.POPULAR]: `
        (SELECT COUNT(*)
        FROM comment_likes
        WHERE comment_likes.comment_id = comments.id) DESC,
        comments.created_at DESC
      `,
    };

    const orderByClause = orderByMap[dto.sort] ?? orderByMap[CommentSortType.NEWEST];

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
        FROM comments
        WHERE post_id = ? AND parent_id IS NULL
        ORDER BY ${orderByClause}
        LIMIT ${lim} OFFSET ${offset}`,
        [dto.postId]
      );

      const [cnt] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total
        FROM comments
        WHERE post_id = ? AND parent_id IS NULL`,
        [dto.postId]
      );

      return {
        comments: rows.map((r) => CommentMapper.toModel(r)),
        total: Number(cnt[0]?.total ?? 0),
      };
    } catch (err) {
      this.logger.error("CommentRepository", CommentLogMessages.findRootByPostFailed, err instanceof Error ? err : null);
      return { comments: [], total: 0 };
    } finally {
      res.conn.release();
    }
  }


  async findRepliesByParentIds(parentIds: number[]): Promise<Comment[]> {
    if (parentIds.length === 0) return [];

    const res = await this.db.getReadConnection();
    if (!res) return [];

    const placeholders = parentIds.map(() => "?").join(",");

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
        FROM comments
        WHERE parent_id IN (${placeholders})
        ORDER BY created_at ASC`,
        parentIds
      );

      return rows.map((r) => CommentMapper.toModel(r));
    } catch (err) {
      this.logger.error("CommentRepository", CommentLogMessages.findRepliesFailed, err instanceof Error ? err : null);
      return [];
    } finally {
      res.conn.release();
    }
  }

  async updateFlagStatus(id: number, isFlagged: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) { return false; }

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
       `UPDATE comments
        SET is_flagged = ?
        WHERE id = ?`,
        [isFlagged, id]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommentRepository", CommentLogMessages.updateFlagStatusFailed, err instanceof Error ? err : null);
      return false;
    } finally {
      res.conn.release();
    }
  }
  
}
