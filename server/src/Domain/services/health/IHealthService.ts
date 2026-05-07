import { DbNodeHealthDto } from "../../DTOs/health/DbNodeHealthDto";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IHealthService {
  getDbHealth(): Promise<ServiceResult<DbNodeHealthDto[]>>;
  triggerFailover(): Promise<ServiceResult<DbNodeHealthDto>>;
}