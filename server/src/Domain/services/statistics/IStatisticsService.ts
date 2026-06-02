import { AdminStatisticsDto } from "../../DTOs/statistics/AdminStatisticsDto";
import { StatisticsDto } from "../../DTOs/statistics/StatisticsDto";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IStatisticsService {
  getDashboardStatistics(userId: number): Promise<ServiceResult<StatisticsDto>>;
  getAdminDashboardStatistics(): Promise<ServiceResult<AdminStatisticsDto>>;
}