import { DbManager } from "../../Database/connection/DbConnectionPool";
import { HealthMessages } from "../../Domain/constants/messages/health/HealthMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { DbNodeHealthDto } from "../../Domain/DTOs/health/DbNodeHealthDto";
import { DbNodeRole } from "../../Domain/enums/nodes/DbNodeRole";
import { NodeStatus } from "../../Domain/enums/nodes/NodeStatus";
import { IHealthService } from "../../Domain/services/health/IHealthService";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { HealthMapper } from "../../Shared/mappers/health/HealthMapper";

export class HealthService implements IHealthService {
  public constructor(
    private readonly db: DbManager
  ) {}

  async getDbHealth(): Promise<ServiceResult<DbNodeHealthDto[]>> {
    const snapshots = this.db.getHealthStatus();

    const data = snapshots.map((snapshot) =>
      HealthMapper.toDbNodeHealthDto(
        snapshot.node,
        snapshot.role,
        snapshot.canServeReads,
      ),
    );

    return ServiceResultFactory.ok(
      HealthMessages.dbHealthFetched,
      data,
      HttpStatus.ok,
    );
  }

  async triggerFailover(): Promise<ServiceResult<DbNodeHealthDto>> {
    if (this.db.isFailoverInProgress()) {
      return ServiceResultFactory.fail(HealthMessages.failoverInProgress, HttpStatus.serviceUnavailable,);
    }

    const newMaster = await this.db.triggerFailover();

    if (!newMaster) {
      return ServiceResultFactory.fail(HealthMessages.noHealthySlave, HttpStatus.serviceUnavailable,);
    }

    const newMasterDto = HealthMapper.toDbNodeHealthDto(
      newMaster,
      DbNodeRole.MASTER,
      newMaster.status !== NodeStatus.OFFLINE,
    );

    return ServiceResultFactory.ok(HealthMessages.failoverSuccess, newMasterDto, HttpStatus.ok,);
  }
}