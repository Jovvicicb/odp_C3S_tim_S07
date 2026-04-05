import { RowDataPacket, ResultSetHeader } from "mysql2";
import { ICommunityRepository } from "../../../Domain/repositories/community/ICommunityRepository";
import { Community } from "../../../Domain/models/Community";
import { CommunityDto  } from "../../../Domain/DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../../Domain/DTOs/community/CreateCommunityDto";
import { CommunityType } from "../../../Domain/enums/CommunityType";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";

export class CommunityRepository implements ICommunityRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  private map(r: RowDataPacket): CommunityDto {
    return new CommunityDto( 
      r.id,
      r.name,
      r.description,
      r.rules,
      r.type as CommunityType,
      r.owner_id,
      r.avatar,
      new Date(r.created_at),
      new Date(r.updated_at));
  }

  async findById(id: number): Promise<CommunityDto | null> {
    const res = await this.db.getReadConnection();
    if (!res) return null;
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(`SELECT * FROM communities  WHERE id = ?`, [id]);
      return rows.length > 0 ? this.map(rows[0]) : null;
    } catch (err) {
      this.logger.error("CommunityRepository", "findById failed", err);
      return null;
    } finally { res.conn.release(); }
  }

  async findAll(page = 1, limit = 20): Promise<CommunityDto[]> {
    const res = await this.db.getReadConnection();
    if (!res) return [];
    const offset = (page - 1) * limit;
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM communities  ORDER BY id DESC LIMIT ? OFFSET ?`, [limit, offset]
      );
      return rows.map((r) => this.map(r));
    } catch (err) {
      this.logger.error("CommunityRepository", "findAll failed", err);
      return [];
    } finally { res.conn.release(); }
  }

  async findByOwnerId(ownerId: number): Promise<CommunityDto[]> {
    const res = await this.db.getReadConnection();
    if (!res) return [];
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM communities WHERE owner_id  = ? ORDER BY id DESC`, [ownerId]
      );
      return rows.map((r) => this.map(r));
    } catch (err) {
      this.logger.error("CommunityRepository", "findByUserId failed", err);
      return [];
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
      this.logger.error("CommunityRepository", "create failed", err);
      return new Community();
    } finally { res.conn.release(); }
  }

  async update(id: number, fields: Partial<Community>): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
      if (entries.length === 0) return false;
      const setClause = entries.map(([k]) => `${k} = ?`).join(", ");
      const values = entries.map(([, v]) => v);
      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE communities SET ${setClause} WHERE id = ?`, [...values, id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommunityRepository", "update failed", err);
      return false;
    } finally { res.conn.release(); }
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `DELETE FROM communities  WHERE id = ?`, [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("CommunityRepository", "delete failed", err);
      return false;
    } finally { res.conn.release(); }
  }
}
