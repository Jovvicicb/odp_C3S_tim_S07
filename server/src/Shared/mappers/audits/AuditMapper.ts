import { RowDataPacket } from "mysql2";
import { Audit } from "../../../Domain/models/Audit";
import { AuditDto } from "../../../Domain/DTOs/audits/AuditDto";

export class AuditMapper {

  public static toModel(row: RowDataPacket): Audit {
    return new Audit(
      Number(row.id),
      Number(row.user_id),
      String(row.action),
      String(row.details),
      String(row.ip_address),
      new Date(row.created_at)
    );
  }
    
  public static toDto(audit: Audit): AuditDto {
    return new AuditDto(
      audit.id,
      audit.userId,
      audit.action,
      audit.details,
      audit.ipAddress,
      audit.createdAt
    );
  }
}