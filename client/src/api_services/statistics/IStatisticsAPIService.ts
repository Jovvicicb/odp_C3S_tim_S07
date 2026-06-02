import type { ApiResponse } from "../../types/common/ApiResponse";
import type { StatisticsDto } from "../../models/statistics/StatisticsDto";
import type { AdminStatisticsDto } from "../../models/statistics/AdminStatisticsDto";

export interface IStatisticsAPIService {
  getDashboardStatistics(): Promise<ApiResponse<StatisticsDto>>;
  getAdminDashboardStatistics(): Promise<ApiResponse<AdminStatisticsDto>>;
}