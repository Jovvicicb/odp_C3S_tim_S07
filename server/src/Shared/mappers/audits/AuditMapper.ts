import { RowDataPacket } from "mysql2";
import { Audit } from "../../../Domain/models/Audit";
import { AuditDto } from "../../../Domain/DTOs/audits/AuditDto";

export class AuditMapper {

  public static toModel(row: RowDataPacket): Audit {
    return new Audit(
      row.id,
      row.user_id,
      row.action,
      row.details,
      row.ip_address,
      new Date(row.created_at)
    );
  }
    
  public static toDto(user: Audit): AuditDto {
    return new AuditDto(
      user.id,
      user.userId,
      user.action,
      user.details,
      user.ipAddress,
      user.createdAt
    );
  }
}