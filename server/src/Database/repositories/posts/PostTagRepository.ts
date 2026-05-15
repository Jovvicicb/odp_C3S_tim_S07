import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IPostTagRepository } from "../../../Domain/repositories/posts/IPostTagRepository";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { PostLogMessages } from "../../../Domain/constants/messages/posts/PostLogMessages";
import { PostTag } from "../../../Domain/models/PostTag";


export class PostTagRepository implements IPostTagRepository {
    public constructor(
        private readonly db: DbManager,
        private readonly logger: ILoggerService
    ){}

    async findTagIdsByPostIds(postIds: number[]): Promise<Record<number, number[]>> {
        if (postIds.length === 0) return {};

        const res = await this.db.getReadConnection();
        if (!res) return {};

        const placeholders = postIds.map(() => "?").join(",");

        try {
            const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT post_id, tag_id
            FROM post_tags
            WHERE post_id IN (${placeholders})`,
            postIds
            );

            return rows.reduce<Record<number, number[]>>((acc, row) => {
                const postId = Number(row.post_id);
                const tagId = Number(row.tag_id);
                if (!acc[postId]) {
                    acc[postId] = [];
                }
                acc[postId].push(tagId);
                return acc;
            }, {});
        } catch (err) {
            this.logger.error("PostTagRepository", PostLogMessages.findPostTagsFailed, err);
            return {};
        } finally {
            res.conn.release();
        }
    }

    async create(postId: number, tagId: number): Promise<PostTag> {
        const res = await this.db.getWriteConnection();
        if(!res) return new PostTag();

        try {
            const [result] = await res.conn.execute<ResultSetHeader>(
                `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`,
                [postId, tagId]
            );

            if (result.insertId === 0) return new PostTag();

            return new PostTag(result.insertId, postId, tagId);  
        } catch (err) {
            this.logger.error("PostTagRepository", PostLogMessages.addTagFailed, err);
            return new PostTag();
        } finally {
            res.conn.release();
        }
    }

    async delete(postId: number, tagId: number): Promise<boolean> {
        const res = await this.db.getWriteConnection();
        if (!res) return false;

        try {
            const [result] = await res.conn.execute<ResultSetHeader>(
            `DELETE FROM post_tags
            WHERE post_id = ? AND tag_id = ?`,
            [postId, tagId]
            );

            return result.affectedRows > 0;
        } catch (err) {
            this.logger.error("PostTagRepository", PostLogMessages.removeTagFailed, err);
            return false;
        } finally {
            res.conn.release();
        }
    }

    
    async exists(postId: number, tagId: number): Promise<boolean> {
        const res = await this.db.getReadConnection();
        if(!res) return false;

        try {
        const [rows] = await res.conn.execute<RowDataPacket[]>(
           `SELECT 1
            FROM post_tags
            WHERE post_id = ? AND tag_id = ?
            LIMIT 1`,
            [postId, tagId]
        );

        return rows.length > 0;
        } catch (err) {
            this.logger.error("PostTagRepository", PostLogMessages.findPostTagFailed, err);
            return false;
        } finally {
            res.conn.release();
        }
    }

}