import { ResultSetHeader, RowDataPacket } from "mysql2";
import { UserFollow } from "../../../Domain/models/UserFollow";
import { IUserFollowRepository } from "../../../Domain/repositories/users/IUserFollowRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { DbManager } from "../../connection/DbConnectionPool";
import { UserLogMessages } from "../../../Domain/constants/messages/users/UserLogMessages";
import { GetFollowersDto } from "../../../Domain/DTOs/users/GetFollowersDto";
import { GetFollowingDto } from "../../../Domain/DTOs/users/GetFollowingDto";

const safeInt = (n: number): number => Math.max(0, Math.floor(n));

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
             this.logger.error("UserFollowRepository", UserLogMessages.createFollowUserFailed, err instanceof Error ? err : null);
            return new UserFollow();
        } finally {
            res.conn.release();
        }
    }

    async delete(followerId: number, followingId: number): Promise<boolean> {
        const res = await this.db.getWriteConnection();
        if(!res) return false;

        try {
            const [result] = await res.conn.execute<ResultSetHeader>(
                `DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?`,
                [followerId, followingId]
            );

            return result.affectedRows > 0;
        } catch (err) {
            this.logger.error("UserFollowRepository", UserLogMessages.deleteFollowUserFailed, err instanceof Error ? err : null);
            return false;
        } finally {
            res.conn.release();
        }
    }

    async getFollowers(dto: GetFollowersDto): Promise<{ followerIds: number[]; total: number }> {
        const res = await this.db.getReadConnection();
        if (!res) return { followerIds: [], total: 0 };

        const {userId,page,limit} = dto;
        const offset = safeInt((page - 1) * limit);
        const lim = safeInt(limit);

        try {
            const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT follower_id
            FROM user_follows
            WHERE following_id = ?
            ORDER BY followed_at DESC
            LIMIT ${lim} OFFSET ${offset}`,
            [userId]
            );

            const [cnt] = await res.conn.execute<RowDataPacket[]>(
            `SELECT COUNT(*) as total FROM user_follows WHERE following_id = ?`,
            [userId]
            );

            return {
            followerIds: rows.map((r) => Number(r.follower_id)),
            total: Number(cnt[0]?.total ?? 0),
            };
        } catch (err) {
            this.logger.error("UserFollowRepository", UserLogMessages.getFollowersFailed, err instanceof Error ? err : null);
            return { followerIds: [], total: 0 };
        } finally {
            res.conn.release();
        }
    }

    async getFollowing(dto: GetFollowingDto): Promise<{ followingIds: number[]; total: number }> {
        const res = await this.db.getReadConnection();
        if (!res) return { followingIds: [], total: 0 };

        const {userId,page,limit} = dto;
        const offset = safeInt((page - 1) * limit);
        const lim = safeInt(limit);

        try {
            const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT following_id
            FROM user_follows
            WHERE follower_id  = ?
            ORDER BY followed_at DESC
            LIMIT ${lim} OFFSET ${offset}`,
            [userId]
            );

            const [cnt] = await res.conn.execute<RowDataPacket[]>(
            `SELECT COUNT(*) as total FROM user_follows WHERE follower_id  = ?`,
            [userId]
            );

            return {
            followingIds: rows.map((r) => Number(r.following_id)),
            total: Number(cnt[0]?.total ?? 0),
            };
        } catch (err) {
            this.logger.error("UserFollowRepository", UserLogMessages.getFollowingFailed, err instanceof Error ? err : null);
            return { followingIds: [], total: 0 };
        } finally {
            res.conn.release();
        }
    }

    async findFollowingIdsByUserId(userId: number): Promise<number[]> {
        const res = await this.db.getReadConnection();
        if (!res) return [];

        try {
            const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT following_id
            FROM user_follows
            WHERE follower_id = ?`,
            [userId]
            );

            return rows.map((r) => Number(r.following_id));
        } catch (err) {
            this.logger.error("UserFollowRepository", UserLogMessages.getFollowingFailed, err instanceof Error ? err : null);
            return [];
        } finally {
            res.conn.release();
        }
    }

    async exists(followerId: number, followingId: number): Promise<boolean> {
        const res = await this.db.getReadConnection();
        if (!res) return false;

        try {
        const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT 1
            FROM user_follows
            WHERE follower_id = ? AND following_id = ? LIMIT 1`,
            [followerId, followingId]
        );

        return rows.length > 0;
        } catch (err) {
        this.logger.error("UserFollowRepository", UserLogMessages.existsFollowUserFailed, err instanceof Error ? err : null);
        return false;
        } finally {
        res.conn.release();
        }
    }

  async findFollowingIdsFromList(followerId: number, targetUserIds: number[]): Promise<number[]> {
    if (targetUserIds.length === 0) {
        return [];
    }

    const res = await this.db.getReadConnection();
    if (!res) {return [];}

    const placeholders = targetUserIds.map(() => "?").join(",");
    try {
        const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT following_id
        FROM user_follows
        WHERE follower_id = ?
        AND following_id IN (${placeholders})`,
        [followerId, ...targetUserIds]
        );

        return rows.map((row) => Number(row.following_id));
    } catch (err) {
        this.logger.error(
        "UserFollowRepository",
        UserLogMessages.findFollowingIdsFromListFailed,
        err instanceof Error ? err : null
        );

        return [];
    } finally {
        res.conn.release();
    }
  }


    async countFollowers(userId: number): Promise<number> {
        const res = await this.db.getReadConnection();

        if (!res) {
            return 0;
        }

        try {
            const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT COUNT(*) AS total
            FROM user_follows
            WHERE following_id = ?`,
            [userId],
            );

            return Number(rows[0]?.total ?? 0);
        } catch (err) {
            this.logger.error(
            "UserFollowRepository",
            UserLogMessages.countFollowersFailed,
            err instanceof Error ? err : null,
            );

            return 0;
        } finally {
            res.conn.release();
        }
    }

    async countFollowing(userId: number): Promise<number> {
        const res = await this.db.getReadConnection();

        if (!res) {
            return 0;
        }

        try {
            const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT COUNT(*) AS total
            FROM user_follows
            WHERE follower_id = ?`,
            [userId],
            );

            return Number(rows[0]?.total ?? 0);
        } catch (err) {
            this.logger.error(
            "UserFollowRepository",
            UserLogMessages.countFollowingFailed,
            err instanceof Error ? err : null,
            );

            return 0;
        } finally {
            res.conn.release();
        }
    }

}