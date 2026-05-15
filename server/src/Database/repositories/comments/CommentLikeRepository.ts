import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DbManager } from "../../connection/DbConnectionPool";
import { ICommentLikeRepository } from "../../../Domain/repositories/comments/ICommentLikeRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { CommentLike } from "../../../Domain/models/CommentLike";
import { CommentLogMessages } from "../../../Domain/constants/messages/comments/CommentLogMessages";


export class CommentLikeRepository implements ICommentLikeRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService
  ){}

  async create(userId: number, commentId: number): Promise<CommentLike> {
    const res = await this.db.getWriteConnection();
    if (!res) return new CommentLike();

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO comment_likes (user_id, comment_id)
         VALUES (?, ?)`,
        [userId, commentId]
      );

      if (result.insertId === 0) return new CommentLike();

      return new CommentLike(
        result.insertId,
        userId,
        commentId
      );
    } catch (err) {
      this.logger.error("CommentLikeRepository", CommentLogMessages.createLikeFailed, err);
      return new CommentLike();
    } finally {
      res.conn.release();
    }
  }

  async delete(userId: number, commentId: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;

    try {
        const [result] = await res.conn.execute<ResultSetHeader>(
        `DELETE FROM comment_likes
        WHERE user_id = ? AND comment_id = ?`,
        [userId, commentId]
        );

        return result.affectedRows > 0;
    } catch (err) {
        this.logger.error("CommentLikeRepository", CommentLogMessages.deleteLikeFailed, err);
        return false;
    } finally {
        res.conn.release();
    }
  }

  async exists(userId: number, commentId: number): Promise<boolean> {
    const res = await this.db.getReadConnection();
    if (!res) return false;

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT 1
         FROM comment_likes
         WHERE user_id = ? AND comment_id = ?
         LIMIT 1`,
        [userId, commentId]
      );

      return rows.length > 0;
    } catch (err) {
      this.logger.error("CommentLikeRepository", CommentLogMessages.existsLikeFailed, err);
      return false;
    } finally {
      res.conn.release();
    }
  }


  async countByCommentIds(commentIds: number[]): Promise<Record<number, number>> {
    if (commentIds.length === 0) return {};

    const res = await this.db.getReadConnection();
    if (!res) return {};
    
    const placeholders = commentIds.map(() => "?").join(",");

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT comment_id, COUNT(*) as total
         FROM comment_likes
         WHERE comment_id IN (${placeholders})
         GROUP BY comment_id`,
        commentIds
      );

      return rows.reduce<Record<number, number>>((acc, row) => {
        acc[Number(row.comment_id)] = Number(row.total);
        return acc;
      }, {});
    } catch (err) {
      this.logger.error("CommentLikeRepository", CommentLogMessages.countLikesFailed, err);
      return {};
    } finally {
      res.conn.release();
    }
  }
  
}