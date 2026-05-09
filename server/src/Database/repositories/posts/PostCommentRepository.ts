import { RowDataPacket } from "mysql2";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { PostLogMessages } from "../../../Domain/constants/messages/posts/PostLogMessages";
import { IPostCommentRepository } from "../../../Domain/repositories/posts/IPostCommentRepository";


export class PostCommentRepository implements IPostCommentRepository {
    public constructor(
        private readonly db: DbManager,
        private readonly logger: ILoggerService
    ){}


    async countByPostIds(postIds: number[]): Promise<Record<number, number>> {
        const res = await this.db.getReadConnection();
        if (!res || postIds.length === 0) return {};

        const placeholders = postIds.map(() => "?").join(",");

        try {
            const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT post_id, COUNT(*) as total
            FROM comments
            WHERE post_id IN (${placeholders})
            GROUP BY post_id`,
            postIds
            );

            return rows.reduce<Record<number, number>>((acc, row) => {
                acc[Number(row.post_id)] = Number(row.total);
                return acc;
            }, {});
        } catch (err) {
            this.logger.error("PostCommentRepository", PostLogMessages.countCommentsFailed, err);
            return {};
        } finally {
            res.conn.release();
        }
    }

}