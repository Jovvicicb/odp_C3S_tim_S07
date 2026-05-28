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
import { GetPostsByUserDto } from "../../../Domain/DTOs/Posts/GetPostsByUserDto";

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
          this.logger.error("PostRepository", PostLogMessages.findByIdFailed, err instanceof Error ? err : null);
          return new Post();
      } finally {
          res.conn.release();
      }
  }

  async findByIds(ids: number[]): Promise<Post[]> {
    if (ids.length === 0) {
      return [];
    }

    const res = await this.db.getReadConnection();

    if (!res) {
      return [];
    }

    const placeholders = ids.map(() => "?").join(",");

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
        FROM posts
        WHERE id IN (${placeholders})`,
        ids,
      );

      return rows.map((row) => PostMapper.toModel(row));
    } catch (err) {
      this.logger.error(
        "PostRepository",
        PostLogMessages.findByIdsFailed,
        err instanceof Error ? err : null,
      );

      return [];
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
      this.logger.error("PostRepository", PostLogMessages.createFailed, err instanceof Error ? err : null);
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
        total: Number(cnt[0]?.total ?? 0),
      };
    } catch (err) {
      this.logger.error("PostRepository", PostLogMessages.findByCommunityFailed, err instanceof Error ? err : null);
      return { posts: [], total: 0 };
    } finally {
      res.conn.release();
    }
  }



  async findFeed(page: number, limit: number, activeCommunityIds: number[], followingUserIds: number[], publicCommunityIds: number[]): Promise<{ posts: Post[]; total: number }> {
    const offset = safeInt((page - 1) * limit);
    const lim = safeInt(limit);

    const allowedCommunityIdsForFollowedPosts = Array.from(
      new Set([...activeCommunityIds, ...publicCommunityIds])
    );

    const whereParts: string[] = [];
    const values: number[] = [];

    if (activeCommunityIds.length > 0) {
      const placeholders = activeCommunityIds.map(() => "?").join(",");
      whereParts.push(`community_id IN (${placeholders})`);
      values.push(...activeCommunityIds);
    }

    if (followingUserIds.length > 0 && allowedCommunityIdsForFollowedPosts.length > 0) {
      const userPlaceholders = followingUserIds.map(() => "?").join(",");
      const communityPlaceholders = allowedCommunityIdsForFollowedPosts.map(() => "?").join(",");

      whereParts.push(
        `(author_id IN (${userPlaceholders}) AND community_id IN (${communityPlaceholders}))`
      );

      values.push(...followingUserIds, ...allowedCommunityIdsForFollowedPosts);
    }

    if (whereParts.length === 0) {
      return { posts: [], total: 0 };
    }

    const res = await this.db.getReadConnection();
    if (!res) return { posts: [], total: 0 };

    const whereClause = `WHERE ${whereParts.join(" OR ")}`;

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
        FROM posts
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${lim} OFFSET ${offset}`,
        values
      );

      const [cnt] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total
        FROM posts
        ${whereClause}`,
        values
      );

      return {
        posts: rows.map((r) => PostMapper.toModel(r)),
        total: Number(cnt[0]?.total ?? 0),
      };
    } catch (err) {
      this.logger.error("PostRepository", PostLogMessages.findFeedFailed, err instanceof Error ? err : null);
      return { posts: [], total: 0 };
    } finally {
      res.conn.release();
    }
  }

  async findCommunityIdsByAuthorId(authorId: number): Promise<number[]> {
    const res = await this.db.getReadConnection();

    if (!res) {
      return [];
    }

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT DISTINCT community_id
        FROM posts
        WHERE author_id = ?`,
        [authorId],
      );

      return rows.map((row) => Number(row.community_id));
    } catch (err) {
      this.logger.error(
        "PostRepository",
        PostLogMessages.findAuthorPostCommunityIdsFailed,
        err instanceof Error ? err : null,
      );

      return [];
    } finally {
      res.conn.release();
    }
  }

  async findAllByAuthorId(dto: GetPostsByUserDto,): Promise<Post[]> {
    const res = await this.db.getReadConnection();

    if (!res) {
      return [];
    }

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
        FROM posts
        WHERE author_id = ?
        ORDER BY created_at DESC`,
        [dto.userId],
      );

      return rows.map((row) => PostMapper.toModel(row));
    } catch (err) {
      this.logger.error(
        "PostRepository",
        PostLogMessages.findByAuthorIdFailed,
        err instanceof Error ? err : null,
      );

      return [];
    } finally {
      res.conn.release();
    }
  }

  async findAllByAuthorIdAndCommunityIds(dto: GetPostsByUserDto, communityIds: number[],): Promise<Post[]> {
    if (communityIds.length === 0) {
      return [];
    }

    const res = await this.db.getReadConnection();

    if (!res) {
      return [];
    }

    const placeholders = communityIds.map(() => "?").join(",");
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
        FROM posts
        WHERE author_id = ?
        AND community_id IN (${placeholders})
        ORDER BY created_at DESC`,
        [dto.userId, ...communityIds],
      );

      return rows.map((row) => PostMapper.toModel(row));
    } catch (err) {
      this.logger.error(
        "PostRepository",
        PostLogMessages.findByAuthorIdFailed,
        err instanceof Error ? err : null,
      );

      return [];
    } finally {
      res.conn.release();
    }
  }

  async update(postId: number, dto: UpdatePostDto): Promise<boolean> {
    const fieldMap: Record<string, string> = {
      title: "title",
      content: "content",
      mediaUrl: "media_url",
    };

    const entries = Object.entries(dto)
      .filter(([, v]) => v !== undefined)
      .map(([key, value]) => [fieldMap[key], value] as const)
      .filter(([column]) => column !== undefined);

    if (entries.length === 0) return false;
    
    const res = await this.db.getWriteConnection();
    if (!res) return false;

    try {
      const setClause = entries.map(([column]) => `${column} = ?`).join(", ");
      const values = entries.map(([, value]) => value);

      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE posts SET ${setClause} WHERE id = ?`,
        [...values, postId]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("PostRepository", PostLogMessages.updateFailed, err instanceof Error ? err : null);
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
      this.logger.error("PostRepository", PostLogMessages.deleteFailed, err instanceof Error ? err : null);
      return false;
    } finally { res.conn.release(); }   
  }

}
