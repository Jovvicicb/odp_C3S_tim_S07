import { RowDataPacket, ResultSetHeader } from "mysql2";
import { ICommunityRepository } from "../../../Domain/repositories/community/ICommunityRepository";
import { Community } from "../../../Domain/models/Community";
import { CreateCommunityDto } from "../../../Domain/DTOs/community/CreateCommunityDto";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { CommunityMapper } from "../../../Shared/mappers/community/CommunityMapper";
import { GetCommunitiesByUserIdDto } from "../../../Domain/DTOs/community/GetCommunitiesByUserIdDto";
import { UpdateCommunityDto } from "../../../Domain/DTOs/community/UpdateCommunityDto";
import { CommunityLogMessages } from "../../../Domain/constants/messages/community/CommunityLogMessages";
import { CommunityType } from "../../../Domain/enums/CommunityType";

const safeInt = (n: number): number => Math.max(0, Math.floor(n));

export class CommunityRepository implements ICommunityRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  async findById(id: number): Promise<Community> {
    const res = await this.db.getReadConnection();
    if (!res) return new Community();

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM communities WHERE id = ?`,
         [id]
      );
      return rows.length > 0 ? CommunityMapper.toModel(rows[0]): new Community();
    } catch (err) {
      this.logger.error("CommunityRepository", CommunityLogMessages.findByIdFailed, err);
      return new Community();
    } finally { res.conn.release(); }
  }

  async findByName(name: string): Promise<Community> {
    const res = await this.db.getReadConnection();
    if (!res) return new Community();

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM communities WHERE name = ?`,
         [name]
      );
      return rows.length > 0 ? CommunityMapper.toModel(rows[0]): new Community();
    } catch (err) {
      this.logger.error("CommunityRepository", CommunityLogMessages.findByName, err);
      return new Community();
    } finally { res.conn.release(); }
  }

  async findAll(page: number, limit: number, type?: CommunityType): Promise<{communities:Community[];total:number}> {
    const res = await this.db.getReadConnection();
    if (!res) return {communities:[],total: 0};

    const offset = safeInt((page - 1) * limit);
    const lim = safeInt(limit);
    const where = type ? `WHERE type = ?` : "";
    try {
       const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
       FROM communities
       ${where}
       ORDER BY created_at DESC
       LIMIT ${lim} OFFSET ${offset}`,
        type ? [type] : [],
      );

       const [cnt] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total
       FROM communities
       ${where}`,
        type ? [type] : [],
      );

      return {
        communities: rows.map((r) => CommunityMapper.toModel(r)),
        total: cnt[0]?.total ?? 0};
    } catch (err) {
      this.logger.error("CommunityRepository", CommunityLogMessages.findAllFailed, err);
      return {communities : [] ,total:0};
    } finally { res.conn.release(); }
  }

  async findByUserId(dto:GetCommunitiesByUserIdDto): Promise<{communities:Community[];total:number}> {
    const res = await this.db.getReadConnection();
    if (!res) return {communities:[],total:0};
    const {userId,page,limit} = dto;
    const offset = safeInt((page - 1) * limit);
    const lim = safeInt(limit);
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM communities
         WHERE  owner_id = ?
         ORDER BY created_at DESC
         LIMIT ${lim} OFFSET ${offset}`,
        [userId],
      );

      const [cnt] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM communities WHERE owner_id = ?`,
        [userId],
      );
      return {
        communities: rows.map((r) => CommunityMapper.toModel(r)),
        total: cnt[0]?.total ?? 0,
      };
    } catch (err) {
      this.logger.error("CommunityRepository", CommunityLogMessages.findByUserIdFailed, err);
      return {communities:[] ,total:0};
    } finally { res.conn.release(); }
  }

  async create(dto: CreateCommunityDto): Promise<Community> {
    const res = await this.db.getWriteConnection();
    if (!res) return new Community();
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
       `INSERT INTO communities (name, description, rules, type, owner_id, avatar)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          dto.name,
          dto.description,
          dto.rules,
          dto.type,
          dto.ownerId,
          dto.avatar
        ]
      );
      if (result.insertId === 0) return new Community();
      return new Community(
        result.insertId,
        dto.name,
        dto.description,
        dto.rules,
        dto.type,
        dto.ownerId,
        dto.avatar
      );
    } catch (err) {
      this.logger.error("CommunityRepository", CommunityLogMessages.createFailed, err);
      return new Community();
    } finally { res.conn.release(); }
  }

  async update(id: number, dto: UpdateCommunityDto): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const entries = Object.entries(dto).filter(([, v]) => v !== undefined);
      if (entries.length === 0) return false;
      const setClause = entries.map(([k]) => `${k} = ?`).join(", ");
      const values = entries.map(([, v]) => v);
      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE communities SET ${setClause} WHERE id = ?`, [...values, id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommunityRepository", CommunityLogMessages.updateFailed, err);
      return false;
    } finally { res.conn.release(); }
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `DELETE FROM communities WHERE id = ?`, [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommunityRepository", CommunityLogMessages.deleteFailed, err);
      return false;
    } finally { res.conn.release(); }
  }
}
