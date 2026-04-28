import { RowDataPacket, ResultSetHeader } from "mysql2";
import { DbManager } from "../../connection/DbConnectionPool";
import { IPostRepository } from "../../../Domain/repositories/posts/IPostRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { CreatePostDto } from "../../../Domain/DTOs/Posts/CreatePostDto";
import { Post } from "../../../Domain/models/Post";
import { PostLogMessages } from "../../../Domain/constants/messages/posts/PostLogMessages";

const safeInt = (n: number): number => Math.max(0, Math.floor(n));

export class PostRepository implements IPostRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const res = await this.db.getWriteConnection();
    if (!res) return new Post();
    try {
        const [result] = await res.conn.execute<ResultSetHeader>(
       `INSERT INTO posts (title, content, media_url, author_id, community_id)
        VALUES (?, ?, ?, ?, ?)`,
        [
            dto.title,
            dto.content,
            dto.mediaUrl,
            dto.authorId,
            dto.communityId
        ]
        );
        if (result.insertId === 0) return new Post();
            return new Post(
            result.insertId,
            dto.title,
            dto.content,
            dto.mediaUrl,
            dto.authorId,
            dto.communityId
            );
    } catch (err) {
      this.logger.error("PostRepository", PostLogMessages.createFailed, err);
      return new Post();
    } finally { res.conn.release(); }
  }

}
