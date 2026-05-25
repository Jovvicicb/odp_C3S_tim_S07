import { StatisticsDto } from "../../DTOs/statistics/StatisticsDto";

export interface IStatisticsRepository {
  getDashboardStatistics(userId: number): Promise<StatisticsDto>;
}