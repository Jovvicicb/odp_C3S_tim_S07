import type { ApiResponse } from "../../types/common/ApiResponse";
import type { StatisticsDto } from "../../models/statistics/StatisticsDto";

export interface IStatisticsAPIService {
  getDashboardStatistics(): Promise<ApiResponse<StatisticsDto>>;
}