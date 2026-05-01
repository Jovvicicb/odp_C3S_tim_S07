import { RowDataPacket, ResultSetHeader } from "mysql2";
import { DbManager } from "../../connection/DbConnectionPool";
import { IPostRepository } from "../../../Domain/repositories/posts/IPostRepository";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { CreatePostDto } from "../../../Domain/DTOs/Posts/CreatePostDto";
import { Post } from "../../../Domain/models/Post";
import { PostLogMessages } from "../../../Domain/constants/messages/posts/PostLogMessages";
import { PostMapper } from "../../../Shared/mappers/posts/PostMapper";
import { UpdatePostDto } from "../../../Domain/DTOs/Posts/UpdatePostDto";
import { GetPostsByCommunityDto } from "../../../Domain/DTOs/Posts/GetPostsByCommunityDto";
import { PostSortType } from "../../../Domain/enums/posts/PostSortType";

const safeInt = (n: number): number => Math.max(0, Math.floor(n));

export class PostRepository implements IPostRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}


  
async findById(id: number): Promise<Post> {
    const res = await this.db.getReadConnection();
    if (!res) return new Post();

    try {
        const [rows] = await res.conn.execute<RowDataPacket[]>(
            `SELECT * FROM posts WHERE id = ? LIMIT 1`,
            [id]
        );

        return rows.length > 0 ? PostMapper.toModel(rows[0]) : new Post();
    } catch (err) {
        this.logger.error("PostRepository", PostLogMessages.findByIdFailed, err);
        return new Post();
    } finally {
        res.conn.release();
    }
}

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
  
  async findByCommunity(dto: GetPostsByCommunityDto): Promise<{ posts: Post[]; total: number }> {
    const res = await this.db.getReadConnection();
    if (!res) return { posts: [], total: 0 };

    const offset = safeInt((dto.page - 1) * dto.limit);
    const lim = safeInt(dto.limit);

    const orderByMap: Record<PostSortType, string> = {
      [PostSortType.NEWEST]: "posts.created_at DESC",
      [PostSortType.POPULAR]: `
        (SELECT COUNT(*)
        FROM post_likes
        WHERE post_likes.post_id = posts.id) DESC,
        posts.created_at DESC
      `,
      [PostSortType.MOST_COMMENTED]: `
        (SELECT COUNT(*)
        FROM comments
        WHERE comments.post_id = posts.id) DESC,
        posts.created_at DESC
      `,
    };

    const orderByClause = orderByMap[dto.sort] ?? orderByMap[PostSortType.NEWEST];

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
        FROM posts
        WHERE community_id = ?
        ORDER BY ${orderByClause}
        LIMIT ${lim} OFFSET ${offset}`,
        [dto.communityId]
      );

      const [cnt] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total
        FROM posts
        WHERE community_id = ?`,
        [dto.communityId]
      );

      return {
        posts: rows.map((r) => PostMapper.toModel(r)),
        total: cnt[0]?.total ?? 0,
      };
    } catch (err) {
      this.logger.error("PostRepository", PostLogMessages.findByCommunityFailed, err);
      return { posts: [], total: 0 };
    } finally {
      res.conn.release();
    }
  }


  async update(postId: number, dto: UpdatePostDto): Promise<boolean> {
  const res = await this.db.getWriteConnection();
  if (!res) return false;

  try {
    const fieldMap: Record<string, string> = {
      title: "title",
      content: "content",
      mediaUrl: "media_url",
    };

    const entries = Object.entries(dto)
      .filter(([, v]) => v !== undefined)
      .map(([key, value]) => [fieldMap[key], value] as const)
      .filter(([column]) => !!column);

    if (entries.length === 0) return false;

    const setClause = entries.map(([column]) => `${column} = ?`).join(", ");
    const values = entries.map(([, value]) => value);

    const [result] = await res.conn.execute<ResultSetHeader>(
      `UPDATE posts SET ${setClause} WHERE id = ?`,
      [...values, postId]
    );

    return result.affectedRows > 0;
  } catch (err) {
    this.logger.error("PostRepository", PostLogMessages.updateFailed, err);
    return false;
  } finally {
    res.conn.release();
  }
}


  async delete(id: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
    const [result] = await res.conn.execute<ResultSetHeader>(
        `DELETE FROM posts WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("PostRepository", PostLogMessages.deleteFailed, err);
      return false;
    } finally { res.conn.release(); }   
}




}
