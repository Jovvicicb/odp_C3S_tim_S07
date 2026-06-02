import { DbNodeHealthDto } from "../../../Domain/DTOs/health/DbNodeHealthDto";
import { DbNodeRole } from "../../../Domain/enums/nodes/DbNodeRole";
import { DbNode } from "../../../Domain/models/DbNode";

export class HealthMapper {
  public static toDbNodeHealthDto(
    node: DbNode,
    role: DbNodeRole,
  ): DbNodeHealthDto {
    return new DbNodeHealthDto(
      node.name,
      role,
      node.host,
      node.port,
      node.status,
      node.lastCheck,
      node.successfulReads,
      node.failedReads,
      node.successfulWrites,
      node.failedWrites,
    );
  }
}