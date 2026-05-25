import { StatisticsMessages } from "../../Domain/constants/messages/statistics/StatisticsMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { StatisticsDto } from "../../Domain/DTOs/statistics/StatisticsDto";
import { IStatisticsRepository } from "../../Domain/repositories/statistics/IStatisticsRepository";
import { IStatisticsService } from "../../Domain/services/statistics/IStatisticsService";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
export class StatisticsService implements IStatisticsService {
  constructor(
    private readonly statisticsRepo: IStatisticsRepository,
  ) {}

  async getDashboardStatistics(userId: number,): Promise<ServiceResult<StatisticsDto>> {
    const data = await this.statisticsRepo.getDashboardStatistics(userId);

    return ServiceResultFactory.ok(StatisticsMessages.fetchDashboardStatisticsSuccess,data, HttpStatus.ok,);
  }
}