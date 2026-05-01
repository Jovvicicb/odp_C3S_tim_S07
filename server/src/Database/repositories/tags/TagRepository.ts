import { RowDataPacket, ResultSetHeader } from "mysql2";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { ITagRepository } from "../../../Domain/repositories/tags/ITagRepository";
import { CreateTagDto } from "../../../Domain/DTOs/tags/CreateTagDto";
import { Tag } from "../../../Domain/models/Tag";
import { TagLogMessages } from "../../../Domain/constants/messages/tags/TagLogMessages";
import { TagMapper } from "../../../Shared/mappers/tags/TagMapper";

const safeInt = (n: number): number => Math.max(0, Math.floor(n));

export class TagRepository implements ITagRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  async findByIds(ids: number[]): Promise<Tag[]> {
  const res = await this.db.getReadConnection();
  if (!res || ids.length === 0) return [];

  const placeholders = ids.map(() => "?").join(",");

  try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT *
       FROM tags
       WHERE id IN (${placeholders})`,
      ids
    );

    return rows.map((r) => TagMapper.toModel(r));
  } catch (err) {
    this.logger.error("TagRepository", TagLogMessages.findByIdsFailed, err);
    return [];
  } finally {
    res.conn.release();
  }
}

  async create(dto: CreateTagDto): Promise<Tag> {
    const res = await this.db.getWriteConnection();
    if (!res) return new Tag();
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
       `INSERT INTO tags (name) VALUES (?)`,
        [dto.name ]
      );
      if (result.insertId === 0) return new Tag();
      return new Tag(
        result.insertId,
        dto.name
      );
    } catch (err) {
      this.logger.error("TagRepository", TagLogMessages.createFailed, err);
      return new Tag();
    } finally { res.conn.release(); }
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `DELETE FROM tags WHERE id = ?`,
        [id]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("TagRepository", TagLogMessages.deleteFailed, err);
      return false;
    } finally { res.conn.release(); }   
  }



  async findById(id: number): Promise<Tag> {
    const res = await this.db.getReadConnection();
    if (!res) return new Tag();

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM tags WHERE id = ? LIMIT 1`,
        [id]
      );

      return rows.length > 0 ? TagMapper.toModel(rows[0]) : new Tag();
    } catch (err) {
      this.logger.error("TagRepository", TagLogMessages.findByIdFailed, err);
      return new Tag();
    } finally {
      res.conn.release();
    }
  }


  async findByName(name: string): Promise<Tag> {
    const res = await this.db.getReadConnection();
    if (!res) return new Tag();

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM tags WHERE name = ?`,
         [name]
      );
      return rows.length > 0 ? TagMapper.toModel(rows[0]) : new Tag();
    } catch (err) {
      this.logger.error("TagRepository", TagLogMessages.findByNameFailed, err);
      return new Tag();
    } finally { res.conn.release(); }
  }


  async findAll(page: number, limit: number): Promise<{ tags: Tag[]; total: number; }> {
   const res = await this.db.getReadConnection();
    if (!res) return {tags:[],total: 0};

    const offset = safeInt((page - 1) * limit);
    const lim = safeInt(limit);
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
       `SELECT * FROM tags ORDER BY name ASC
        LIMIT ${lim} OFFSET ${offset}`
    );

    const [cnt] = await res.conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM tags`
    );

    return {
            tags: rows.map((r) => TagMapper.toModel(r)),
            total: cnt[0]?.total ?? 0};
    } catch (err) {
      this.logger.error("TagRepository", TagLogMessages.findAllFailed, err);
      return {tags : [] ,total:0};
    } finally { res.conn.release(); }
  }

}
