import { DbNodeHealthDto } from "../../../Domain/DTOs/health/DbNodeHealthDto";
import { DbNode } from "../../../Domain/models/DbNode";

export class HealthMapper {
  public static toDbNodeHealthDto(node: DbNode): DbNodeHealthDto {
    return new DbNodeHealthDto(
      node.name,
      node.host,
      node.port,
      node.status,
      node.lastCheck,
      node.successfulWrites,
      node.failedWrites
    );
  }
}