import { RowDataPacket, ResultSetHeader } from "mysql2";
import { ICommunityMemberRepository } from "../../../Domain/repositories/community/ICommunityMemberRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { DbManager } from "../../connection/DbConnectionPool";
import { CommunityMemberStatus } from "../../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityLogMessages } from "../../../Domain/constants/messages/community/CommunityLogMessages";
import { CommunityMember } from "../../../Domain/models/CommunityMember";
import { CommunityMemberMapper } from "../../../Shared/mappers/community/CommunityMemberMapper";


export class CommunityMemberRepository implements ICommunityMemberRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  
  async create(userId: number, communityId: number, status: CommunityMemberStatus): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO community_members (user_id, community_id, status)
        VALUES (?, ?, ?)`,
        [userId, communityId, status]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommunityMemberRepository", CommunityLogMessages.createFailed, err);
      return false;
    } finally { 
      res.conn.release(); 
    }
  }

   async findByUserIdAndCommunityId(userId: number, communityId: number): Promise<CommunityMember> {
    const res = await this.db.getReadConnection();
    if (!res) return new CommunityMember();

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
         FROM community_members
         WHERE user_id = ? AND community_id = ?
         LIMIT 1`,
        [userId, communityId]
      );

      return rows.length > 0
        ? CommunityMemberMapper.toModel(rows[0])
        : new CommunityMember();
    } catch (err) {
      this.logger.error("CommunityMemberRepository", CommunityLogMessages.findByUserIdAndCommunityid, err);
      return new CommunityMember();
    } finally {
      res.conn.release();
    }
  }

  async exists(userId: number, communityId: number): Promise<boolean> {
    const res = await this.db.getReadConnection();
    if (!res) return false;
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as cnt
        FROM community_members
        WHERE user_id = ? AND community_id = ?`,
        [userId, communityId]
       );

      return (rows[0]?.cnt ?? 0) > 0;
    } catch (err) {
      this.logger.error("CommunityMemberRepository", CommunityLogMessages.exists, err);
      return false;
    } finally { 
      res.conn.release(); 
    }
  }
  

}
