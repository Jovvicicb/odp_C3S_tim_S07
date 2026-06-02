import { AdminStatisticsDto } from "../../DTOs/statistics/AdminStatisticsDto";
import { StatisticsDto } from "../../DTOs/statistics/StatisticsDto";

export interface IStatisticsRepository {
  getDashboardStatistics(userId: number): Promise<StatisticsDto>;
  getAdminDashboardStatistics(): Promise<AdminStatisticsDto>;
}