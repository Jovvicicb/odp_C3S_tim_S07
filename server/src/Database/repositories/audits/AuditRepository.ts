import { ILoggerService } from "../../../Domain/services/logger/ILoggerService";
import { IAuditRepository } from "../../../Domain/repositories/audits/IAuditRepository";
import { Audit } from "../../../Domain/models/Audit";
import { DbManager } from '../../connection/DbConnectionPool';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { AuditLogMessages } from '../../../Domain/constants/messages/audits/AuditLogMessages';
import { GetAuditsDto } from '../../../Domain/DTOs/audits/GetAuditsDto';
import { AuditMapper } from '../../../Shared/mappers/audits/AuditMapper';
import { CreateAuditDto } from '../../../Domain/DTOs/audits/CreateAuditDto';

const safeInt = (n: number): number => Math.max(0, Math.floor(n));

export class AuditRepository implements IAuditRepository {
  public constructor(
    private readonly db: DbManager,
    private readonly logger: ILoggerService,
  ) {}

  async create(dto: CreateAuditDto): Promise<Audit> {
    const res = await this.db.getWriteConnection();
    if (!res) return new Audit();
    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
      `INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)`,
        [
          dto.userId,
          dto.action,
          dto.details,
          dto.ipAddress
        ]
      );
      if (result.insertId === 0) return new Audit();
      return new Audit(
        result.insertId,
        dto.userId,
        dto.action,
        dto.details,
        dto.ipAddress
      );
    } catch (err) {
      this.logger.error("AuditRepository", AuditLogMessages.createFailed, err instanceof Error ? err : null);
      return new Audit();
    } finally { res.conn.release(); }
  }

  async findAll(dto:GetAuditsDto): Promise<{audits:Audit[];total:number}> {
    const res = await this.db.getReadConnection();
    if (!res) return {audits:[],total: 0};

    const {page,limit} = dto;
    
    const offset = safeInt((page - 1) * limit);
    const lim = safeInt(limit);
    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT * FROM audit_logs
       ORDER BY created_at DESC
       LIMIT ${lim} OFFSET ${offset}`
      );

      const [cnt] = await res.conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM audit_logs`
      );
      return {
              audits: rows.map((r) => AuditMapper.toModel(r)),
              total: Number(cnt[0]?.total ?? 0)};
    } catch (err) {
      this.logger.error("AuditRepository", AuditLogMessages.findAllFailed, err instanceof Error ? err : null);
      return {audits : [] ,total:0};
    } finally { res.conn.release(); }
  }
}