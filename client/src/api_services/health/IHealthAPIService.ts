import type { DbNodeHealthDto } from "../../models/health/DbNodeHealthDto";
import type { ServerHealthDto } from "../../models/health/ServerHealthDto";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IHealthAPIService {
  getServerHealth(): Promise<ApiResponse<ServerHealthDto>>;
  getDbHealth(): Promise<ApiResponse<DbNodeHealthDto[]>>;
  triggerFailover(): Promise<ApiResponse<DbNodeHealthDto>>;
}