import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { PostLogMessages } from "../../../Domain/constants/messages/posts/PostLogMessages";
import { IPostLikeRepository } from "../../../Domain/repositories/posts/IPostLikeRepository";
import { PostLike } from "../../../Domain/models/PostLike";

export class PostLikeRepository implements IPostLikeRepository {
    public constructor(
        private readonly db: DbManager,
        private readonly logger: ILoggerService
    ){}

    async countByPostIds(postIds: number[]): Promise<Record<number, number>> {
        if (postIds.length === 0) return {};

        const res = await this.db.getReadConnection();
        if (!res) return {};

        const placeholders = postIds.map(() => "?").join(",");

        try {
            const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT post_id, COUNT(*) as total
            FROM post_likes
            WHERE post_id IN (${placeholders})
            GROUP BY post_id`,
            postIds
            );

            return rows.reduce<Record<number, number>>((acc, row) => {
                acc[Number(row.post_id)] = Number(row.total);
                return acc;
            }, {});
        } catch (err) {
            this.logger.error("PostLikeRepository", PostLogMessages.countLikesFailed, err instanceof Error ? err : null);
            return {};
        } finally {
            res.conn.release();
        }
    }

    async create(userId: number, postId: number): Promise<PostLike> {
        const res = await this.db.getWriteConnection();
        if(!res) return new PostLike();

        try {
             const [result] = await res.conn.execute<ResultSetHeader>(
                `INSERT INTO post_likes (user_id, post_id)
                VALUES (?, ?)`,
                [userId, postId]
            );
            if (result.insertId === 0) return new PostLike();

            return new PostLike(result.insertId, userId, postId);  
        } catch (err) {
            this.logger.error("PostLikeRepository", PostLogMessages.likeFailed, err instanceof Error ? err : null);
            return new PostLike();
        } finally {
            res.conn.release();
        }
    }

    
    async delete(userId: number, postId: number): Promise<boolean> {
        const res = await this.db.getWriteConnection();
        if(!res) return false;

        try {
            const [result] = await res.conn.execute<ResultSetHeader>(
            `DELETE FROM post_likes
            WHERE user_id = ? AND post_id = ?`,
            [userId, postId]
            );

            return result.affectedRows > 0;
        } catch (err) {
            this.logger.error("PostLikeRepository", PostLogMessages.unlikeFailed, err instanceof Error ? err : null);
            return false;
        } finally {
            res.conn.release();
        }
    }

    async exists(userId: number, postId: number): Promise<boolean> {
        const res = await this.db.getReadConnection();
        if(!res) return false;

        try {
        const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT 1
            FROM post_likes
            WHERE user_id = ? AND post_id = ?
            LIMIT 1`,
            [userId, postId]
        );

        return rows.length > 0;
        } catch (err) {
            this.logger.error("PostLikeRepository", PostLogMessages.findLikeFailed, err instanceof Error ? err : null);
            return false;
        } finally {
            res.conn.release();
        }
    }

}