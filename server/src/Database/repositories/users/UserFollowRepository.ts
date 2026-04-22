import { ResultSetHeader, RowDataPacket } from "mysql2";
import { UserFollow } from "../../../Domain/models/UserFollow";
import { IUserFollowRepository } from "../../../Domain/repositories/users/IUserFollowRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { DbManager } from "../../connection/DbConnectionPool";
import { UserLogMessages } from "../../../Domain/constants/messages/user/UserLogMessages";

export class UserFollowRepository implements IUserFollowRepository {
    public constructor(
        private readonly db: DbManager,
        private readonly logger: ILoggerService
    ){}


    async create(followerId: number, followingId: number): Promise<UserFollow> {
        const res = await this.db.getWriteConnection();
        if(!res) return new UserFollow();

        try {
        const [result] = await res.conn.execute<ResultSetHeader>(
            `INSERT INTO user_follows (follower_id, following_id) VALUES (?, ?)`,
            [followerId, followingId]
        );

        if (result.insertId === 0) return new UserFollow();

        return new UserFollow(result.insertId, followerId, followingId);
        } catch (err) {
        this.logger.error("UserFollowRepository", UserLogMessages.createFolowUserFaild, err);
        return new UserFollow();
        } finally {
        res.conn.release();
        }
    }

    async exists(followerId: number, followingId: number): Promise<boolean> {
        const res = await this.db.getReadConnection();
        if (!res) return false;

        try {
        const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT COUNT(*) as cnt
            FROM user_follows
            WHERE follower_id = ? AND following_id = ?`,
            [followerId, followingId]
        );

        return (rows[0]?.cnt ?? 0) > 0;
        } catch (err) {
        this.logger.error("UserFollowRepository", UserLogMessages.existsFolowUserFaild, err);
        return false;
        } finally {
        res.conn.release();
        }
    }

}