import { RowDataPacket, ResultSetHeader } from "mysql2";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { ITagRepository } from "../../../Domain/repositories/tags/ITagRepository";
import { CreateTagDto } from "../../../Domain/DTOs/tags/CreateTagDto";
import { Tag } from "../../../Domain/models/Tag";
import { TagLogMessages } from "../../../Domain/constants/messages/tags/TagLogMessages";
import { TagMapper } from "../../../Shared/mappers/tags/TagMapper";


export class TagRepository implements ITagRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

 
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

}
