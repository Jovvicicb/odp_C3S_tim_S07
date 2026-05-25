import { RowDataPacket } from "mysql2";

import { DbManager } from "../../connection/DbConnectionPool";
import { StatisticsDto } from "../../../Domain/DTOs/statistics/StatisticsDto";
import { IStatisticsRepository } from "../../../Domain/repositories/statistics/IStatisticsRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { CommunityMemberStatus } from "../../../Domain/enums/communities/CommunityMemberStatus";

export class StatisticsRepository implements IStatisticsRepository {
  constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  async getDashboardStatistics(userId: number): Promise<StatisticsDto> {
    const res = await this.db.getReadConnection();

    if (!res) {
      return new StatisticsDto();
    }

    try {
      const [joinedRows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) AS total
         FROM community_members
         WHERE user_id = ? AND status = ?`,
        [userId, CommunityMemberStatus.ACTIVE],
      );

      const [postsRows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) AS total
         FROM posts
         WHERE author_id = ?`,
        [userId],
      );

      const [followersRows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) AS total
         FROM user_follows
         WHERE following_id = ?`,
        [userId],
      );

      const [followingRows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) AS total
         FROM user_follows
         WHERE follower_id = ?`,
        [userId],
      );

      return new StatisticsDto(
        Number(joinedRows[0]?.total ?? 0),
        Number(postsRows[0]?.total ?? 0),
        Number(followersRows[0]?.total ?? 0),
        Number(followingRows[0]?.total ?? 0),
      );
    } catch (err) {
      this.logger.error(
        "StatisticsRepository",
        "Failed to fetch dashboard statistics",
        err instanceof Error ? err : null,
      );

      return new StatisticsDto();
    } finally {
      res.conn.release();
    }
  }
}