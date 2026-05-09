import { RowDataPacket, ResultSetHeader } from "mysql2";
import { ICommunityMemberRepository } from "../../../Domain/repositories/community/ICommunityMemberRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { DbManager } from "../../connection/DbConnectionPool";
import { CommunityMemberStatus } from "../../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityLogMessages } from "../../../Domain/constants/messages/community/CommunityLogMessages";
import { CommunityMember } from "../../../Domain/models/CommunityMember";
import { CommunityMemberMapper } from "../../../Shared/mappers/community/CommunityMemberMapper";
import { CommunityMemberRole } from "../../../Domain/enums/communities/CommunityMemberRole";

const safeInt = (n: number): number => Math.max(0, Math.floor(n));

export class CommunityMemberRepository implements ICommunityMemberRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  async findCommunityIdsByUserId(page: number, limit: number, userId: number): Promise<{ communityIds: number[]; total: number}> {
    const res = await this.db.getReadConnection();
      if (!res) return { communityIds: [], total: 0 };

    const offset = safeInt((page - 1) * limit);
    const lim = safeInt(limit);

    try {
        const [rows] = await res.conn.execute<RowDataPacket[]>(
         `SELECT community_id
          FROM community_members
          WHERE user_id = ? AND status = ?
          ORDER BY joined_at DESC
          LIMIT ${lim} OFFSET ${offset}`,
          [userId, CommunityMemberStatus.ACTIVE]
        );

        const [cnt] = await res.conn.execute<RowDataPacket[]>(
          `SELECT COUNT(*) as total
          FROM community_members
          WHERE user_id = ? AND status = ?`,
          [userId, CommunityMemberStatus.ACTIVE]
        );

        return {
        communityIds: rows.map((r) => Number(r.community_id)),
        total: cnt[0]?.total ?? 0,
        };
    } catch (err) {
        this.logger.error("CommunityMemberRepository", CommunityLogMessages.findMyCommunitiesFailed, err);
        return { communityIds: [], total: 0 };
    } finally {
        res.conn.release();
    }   
 }

 async findActiveCommunityIdsByUserId(userId: number): Promise<number[]> {
  const res = await this.db.getReadConnection();
  if (!res) return [];

  try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT community_id
       FROM community_members
       WHERE user_id = ? AND status = ?`,
      [userId, CommunityMemberStatus.ACTIVE]
    );

    return rows.map((r) => Number(r.community_id));
  } catch (err) {
    this.logger.error("CommunityMemberRepository", CommunityLogMessages.findActiveCommunityIdsFailed, err);
    return [];
  } finally {
    res.conn.release();
  }
}

 async findUserIdsByCommunityId(page: number, limit: number, communityId: number): Promise<{ userIds: number[]; total: number}> {
    const res = await this.db.getReadConnection();
    if (!res) return { userIds: [], total: 0 };

    const offset = safeInt((page - 1) * limit);
    const lim = safeInt(limit);

    try {
        const [rows] = await res.conn.execute<RowDataPacket[]>(
         `SELECT user_id
          FROM community_members
          WHERE community_id = ? AND status = ?
          ORDER BY joined_at DESC
          LIMIT ${lim} OFFSET ${offset}`,
          [communityId, CommunityMemberStatus.ACTIVE]
        );

        const [cnt] = await res.conn.execute<RowDataPacket[]>(
          `SELECT COUNT(*) as total
          FROM community_members
          WHERE community_id = ? AND status = ?`,
          [communityId, CommunityMemberStatus.ACTIVE]
        );

        return {
          userIds: rows.map((r) => Number(r.user_id)),
          total: cnt[0]?.total ?? 0,
        };
    } catch (err) {
        this.logger.error("CommunityMemberRepository", CommunityLogMessages.findMembersFailed, err);
        return { userIds: [], total: 0 };
    } finally {
        res.conn.release();
    }   
 }

  
  async create(userId: number, communityId: number, role: CommunityMemberRole, status: CommunityMemberStatus): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO community_members (user_id, community_id, role, status)
        VALUES (?, ?, ?, ?)`,
        [userId, communityId, role, status]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommunityMemberRepository", CommunityLogMessages.createFailed, err);
      return false;
    } finally { 
      res.conn.release(); 
    }
  }

  async updateRole(userId: number, communityId: number, role: CommunityMemberRole): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
       const [result] = await res.conn.execute<ResultSetHeader>(
          `UPDATE community_members
          SET role = ?
          WHERE user_id = ? AND community_id = ?`,
          [role, userId, communityId]
        );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommunityMemberRepository", CommunityLogMessages.updateMemberRoleFailed, err);
      return false;
    } finally { 
      res.conn.release(); 
    }
  }

  async updateStatus(userId: number, communityId: number, status: CommunityMemberStatus): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
       const [result] = await res.conn.execute<ResultSetHeader>(
         `UPDATE community_members
          SET status = ?
          WHERE user_id = ? AND community_id = ?`,
          [status, userId, communityId]
        );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommunityMemberRepository", CommunityLogMessages.updateMemberStatusFailed, err);
      return false;
    } finally { 
      res.conn.release(); 
    }
  }

  async delete(userId: number, communityId: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
      `DELETE FROM community_members
       WHERE user_id = ? AND community_id = ?`,
      [userId, communityId]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommunityMemberRepository", CommunityLogMessages.deleteFailed, err);
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
      this.logger.error("CommunityMemberRepository", CommunityLogMessages.findByUserIdAndCommunityId, err);
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
       `SELECT 1
        FROM community_members
        WHERE user_id = ? AND community_id = ?
        LIMIT 1`,
        [userId, communityId]
       );

      return rows.length > 0;
    } catch (err) {
      this.logger.error("CommunityMemberRepository", CommunityLogMessages.exists, err);
      return false;
    } finally { 
      res.conn.release(); 
    }
  }
  

}
