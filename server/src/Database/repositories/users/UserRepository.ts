import { RowDataPacket, ResultSetHeader } from "mysql2";
import { IUserRepository } from "../../../Domain/repositories/users/IUserRepository";
import { User } from "../../../Domain/models/User";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { UserMapper } from "../../../Shared/mappers/users/UserMapper";
import { GetUsersDto } from "../../../Domain/DTOs/users/GetUsersDto";
import { UserLogMessages } from "../../../Domain/constants/messages/user/UserLogMessages";
import { UpdateMeDto } from "../../../Domain/DTOs/users/UpdateMeDto";
import { UserRole } from "../../../Domain/enums/users/UserRole";


const safeInt = (n: number): number => Math.max(0, Math.floor(n));


export class UserRepository implements IUserRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  async create(user: User): Promise<User> {
    const res = await this.db.getWriteConnection();
    if (!res) return new User();
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO users (username, email, role, password_hash,fullname,bio,profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.username, user.email, user.role, user.passwordHash,user.fullname,user.bio,user.image]
      );
      if (result.insertId === 0) return new User();
      return new User(result.insertId, user.username, user.email, user.role, user.passwordHash,user.fullname,user.bio,user.image);
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.createFailed, err);
      return new User();
    } finally { res.conn.release(); }
  }

  async findById(id: number): Promise<User> {
    const res = await this.db.getReadConnection();
    if (!res) return new User();
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
      return rows.length > 0 ? UserMapper.toModel(rows[0]) : new User();
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.findByIdFailed, err);
      return new User();
    } finally { res.conn.release(); }
  }

  async findByIds(ids: number[]): Promise<User[]> {
    if (ids.length === 0) return [];

    const res = await this.db.getReadConnection();
    if (!res) return [];

    try {
      const placeholders = ids.map(() => "?").join(",");
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT * FROM users WHERE id IN (${placeholders})`,
        ids
      );

      return rows.map((r) => UserMapper.toModel(r));
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.findByIdsFailed, err);
      return [];
    } finally {
      res.conn.release();
    }
  }

  async findByUsername(username: string): Promise<User> {
    const res = await this.db.getReadConnection();
    if (!res) return new User();
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(`SELECT * FROM users WHERE username = ? LIMIT 1`, [username]);
      return rows.length > 0 ? UserMapper.toModel(rows[0]) : new User();
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.findByUsernameFailed, err);
      return new User();
    } finally { res.conn.release(); }
  }

  async searchByUsername(username: string,page: number,limit: number): Promise<{ users: User[]; total: number }> {
    if (!username.trim()) {
      return { users: [], total: 0 };
    }

    const res = await this.db.getReadConnection();

    if (!res) {
      return { users: [], total: 0 };
    }

    const offset = safeInt((page - 1) * limit);
    const lim = safeInt(limit);
    const searchValue = `%${username.trim()}%`;

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT *
        FROM users
        WHERE username LIKE ?
        ORDER BY username ASC
        LIMIT ${lim} OFFSET ${offset}`,
        [searchValue]
      );

      const [cnt] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total
        FROM users
        WHERE username LIKE ?`,
        [searchValue]
      );

      return {
        users: rows.map((row) => UserMapper.toModel(row)),
        total: Number(cnt[0]?.total ?? 0),
      };
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.searchByUsernameFailed, err);
      return { users: [], total: 0 };
    } finally {
      res.conn.release();
    }
  }
    
  async findByEmail(email: string): Promise<User> {
    const res = await this.db.getReadConnection();
    if (!res) return new User();
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
      return rows.length > 0 ? UserMapper.toModel(rows[0]) : new User();
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.findByEmailFailed, err);
      return new User();
    } finally { res.conn.release(); }
  }

  async findAll(dto:GetUsersDto): Promise<{users:User[];total:number}> {
    const res = await this.db.getReadConnection();
    if (!res) return {users:[],total: 0};

    const {page,limit} = dto;
    
    const offset = safeInt((page - 1) * limit);
    const lim = safeInt(limit);
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT * FROM users
       ORDER BY id ASC
       LIMIT ${lim} OFFSET ${offset}`
    );

      const [cnt] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM users`
      );

      return {
              users: rows.map((r) => UserMapper.toModel(r)),
              total: Number(cnt[0]?.total ?? 0)};
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.findAllFailed, err);
      return {users : [] ,total:0};
    } finally { res.conn.release(); }
  }

  async update(userId: number, dto: UpdateMeDto): Promise<boolean> {
    const fieldMap: Record<string, string> = {
        username: "username",
        email: "email",
        password: "password_hash",
        fullname: "fullname",
        bio: "bio",
        profilePicture: "profile_picture",
      };

    const entries = Object.entries(dto)
      .filter(([, v]) => v !== undefined)
      .map(([key, value]) => [fieldMap[key], value] as const)
      .filter(([column]) => !!column);

    if (entries.length === 0) return false;
    
    const res = await this.db.getWriteConnection();
    if (!res) return false;

    try {
      const setClause = entries.map(([column]) => `${column} = ?`).join(", ");
      const values = entries.map(([, value]) => value);

      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        [...values, userId]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.updateFailed, err);
      return false;
    } finally {
      res.conn.release();
    }
  }

  async exists(id: number): Promise<boolean> {
    const res = await this.db.getReadConnection();
    if (!res) return false;
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT 1 FROM users WHERE id = ? LIMIT 1`, [id]
      );
      return rows.length > 0;
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.existsFailed, err);
      return false;
    } finally { res.conn.release(); }
  }

  async updateRole(id: number, role: UserRole): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE users SET role = ? WHERE id = ?`,
        [role, id]
      );

      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("UserRepository", UserLogMessages.updateRoleFailed, err);
      return false;
    } finally {
      res.conn.release();
    }
  }
}
