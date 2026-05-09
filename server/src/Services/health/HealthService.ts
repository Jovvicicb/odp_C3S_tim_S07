import { DbManager } from "../../Database/connection/DbConnectionPool";
import { HealthMessages } from "../../Domain/constants/messages/health/HealthMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { DbNodeHealthDto } from "../../Domain/DTOs/health/DbNodeHealthDto";
import { IHealthService } from "../../Domain/services/health/IHealthService";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { HealthMapper } from "../../Shared/mappers/health/HealthMapper";

export class HealthService implements IHealthService {
  public constructor(
    private readonly db: DbManager
  ) {}

  async getDbHealth(): Promise<ServiceResult<DbNodeHealthDto[]>> {
    const nodes = this.db.getNodes();
    const data = nodes.map((node) => HealthMapper.toDbNodeHealthDto(node));
    return ServiceResultFactory.ok(HealthMessages.dbHealthFetched, data, HttpStatus.ok);
  }

  async triggerFailover(): Promise<ServiceResult<DbNodeHealthDto>> {
    const newMaster = await this.db.triggerFailover();
    if (!newMaster) {
        return ServiceResultFactory.fail( HealthMessages.noHealthySlave, HttpStatus.internalServerError);
    }

    const data = HealthMapper.toDbNodeHealthDto(newMaster);

    return ServiceResultFactory.ok(HealthMessages.failoverSuccess, data, HttpStatus.ok);
  }

}