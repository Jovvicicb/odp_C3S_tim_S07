// TODO: Replace Entity, EntityDto, CreateEntityDto with your domain types
// TODO: Replace table name "entities" with your actual table name
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { IEntityRepository } from "../../../Domain/repositories/entity/IEntityRepository";
import { Entity } from "../../../Domain/models/Entity";
import { EntityDto } from "../../../Domain/DTOs/entity/EntityDto";
import { CreateEntityDto } from "../../../Domain/DTOs/entity/CreateEntityDto";
import { EntityStatus } from "../../../Domain/enums/EntityStatus";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";

export class EntityRepository implements IEntityRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  private map(r: RowDataPacket): EntityDto {
    return new EntityDto(r.id, r.userId, r.status as EntityStatus, new Date(r.createdAt));
  }

  async findById(id: number): Promise<EntityDto | null> {
    const res = await this.db.getReadConnection();
    if (!res) return null;
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(`SELECT * FROM entities WHERE id = ?`, [id]);
      return rows.length > 0 ? this.map(rows[0]) : null;
    } catch (err) {
      this.logger.error("EntityRepository", "findById failed", err);
      return null;
    } finally { res.conn.release(); }
  }

  async findAll(page = 1, limit = 20): Promise<EntityDto[]> {
    const res = await this.db.getReadConnection();
    if (!res) return [];
    const offset = (page - 1) * limit;
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM entities ORDER BY id DESC LIMIT ? OFFSET ?`, [limit, offset]
      );
      return rows.map((r) => this.map(r));
    } catch (err) {
      this.logger.error("EntityRepository", "findAll failed", err);
      return [];
    } finally { res.conn.release(); }
  }

  async findByUserId(userId: number): Promise<EntityDto[]> {
    const res = await this.db.getReadConnection();
    if (!res) return [];
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM entities WHERE userId = ? ORDER BY id DESC`, [userId]
      );
      return rows.map((r) => this.map(r));
    } catch (err) {
      this.logger.error("EntityRepository", "findByUserId failed", err);
      return [];
    } finally { res.conn.release(); }
  }

  async create(dto: CreateEntityDto): Promise<Entity> {
    const res = await this.db.getWriteConnection();
    if (!res) return new Entity();
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO entities (userId) VALUES (?)`,
        [dto.userId]
      );
      if (result.insertId === 0) return new Entity();
      return new Entity(result.insertId, dto.userId);
    } catch (err) {
      this.logger.error("EntityRepository", "create failed", err);
      return new Entity();
    } finally { res.conn.release(); }
  }

  async update(id: number, fields: Partial<Entity>): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
      if (entries.length === 0) return false;
      const setClause = entries.map(([k]) => `${k} = ?`).join(", ");
      const values = entries.map(([, v]) => v);
      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE entities SET ${setClause} WHERE id = ?`, [...values, id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("EntityRepository", "update failed", err);
      return false;
    } finally { res.conn.release(); }
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `DELETE FROM entities WHERE id = ?`, [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("EntityRepository", "delete failed", err);
      return false;
    } finally { res.conn.release(); }
  }
}
