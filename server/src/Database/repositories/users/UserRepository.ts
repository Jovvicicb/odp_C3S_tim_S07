import { RowDataPacket, ResultSetHeader } from "mysql2";
import { IUserRepository } from "../../../Domain/repositories/users/IUserRepository";
import { User } from "../../../Domain/models/User";
import { DbManager } from "../../connection/DbConnectionPool";
import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { UserMapper } from "../../../Shared/mappers/users/UserMapper";
import { GetUsersDto } from "../../../Domain/DTOs/users/GetUsersDto";


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
      this.logger.error("UserRepository", "create failed", err);
      return new User();
    } finally { res.conn.release(); }
  }

  async findById(id: number): Promise<User> {
    const res = await this.db.getReadConnection();
    if (!res) return new User();
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(`SELECT * FROM users WHERE id = ?`, [id]);
      return rows.length > 0 ? UserMapper.toModel(rows[0]) : new User();
    } catch (err) {
      this.logger.error("UserRepository", "findById failed", err);
      return new User();
    } finally { res.conn.release(); }
  }
async findByUsername(username: string): Promise<User> {
    const res = await this.db.getReadConnection();
    if (!res) return new User();
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(`SELECT * FROM users WHERE username = ?`, [username]);
      return rows.length > 0 ? UserMapper.toModel(rows[0]) : new User();
    } catch (err) {
      this.logger.error("UserRepository", "findByUsername failed", err);
      return new User();
    } finally { res.conn.release(); }
  }
  
  async findByEmail(email: string): Promise<User> {
    const res = await this.db.getReadConnection();
    if (!res) return new User();
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [email]);
      return rows.length > 0 ? UserMapper.toModel(rows[0]) : new User();
    } catch (err) {
      this.logger.error("UserRepository", "findByEmail failed", err);
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
              total: cnt[0]?.total ?? 0};
    } catch (err) {
      this.logger.error("UserRepository", "findAll failed", err);
      return {users : [] ,total:0};
    } finally { res.conn.release(); }
  }

  async update(user: User): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE users SET username = ?, email = ?, role = ?, is_active = ?, fullname = ?,bio = ?,profile_picture =? WHERE id = ?`,
        [user.username, user.email, user.role, user.isActive, user.fullname ,user.bio,user.image,user.id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("UserRepository", "update failed", err);
      return false;
    } finally { res.conn.release(); }
  }

  async deactivate(id: number): Promise<boolean> {
    const res = await this.db.getWriteConnection();
    if (!res) return false;
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE users SET is_active = 0 WHERE id = ?`, [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      this.logger.error("UserRepository", "deactivate failed", err);
      return false;
    } finally { res.conn.release(); }
  }

  async exists(id: number): Promise<boolean> {
    const res = await this.db.getReadConnection();
    if (!res) return false;
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as cnt FROM users WHERE id = ?`, [id]
      );
      return (rows[0]?.cnt ?? 0) > 0;
    } catch (err) {
      this.logger.error("UserRepository", "exists failed", err);
      return false;
    } finally { res.conn.release(); }
  }
}
