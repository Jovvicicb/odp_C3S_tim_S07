import { Request, Response, Router } from "express";

import { StatisticsLogMessages } from "../../Domain/constants/messages/statistics/StatisticsLogMessages";
import { StatisticsMessages } from "../../Domain/constants/messages/statistics/StatisticsMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { IStatisticsService } from "../../Domain/services/statistics/IStatisticsService";

import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";

export class StatisticsController {
  private readonly router = Router();

  public constructor(
    private readonly statisticsService: IStatisticsService,
    private readonly logger: ILoggerService,
  ) {
    this.router.get("/statistics/dashboard",       authenticate, authorize(UserRole.USER, UserRole.ADMIN), this.getDashboardStatistics.bind(this));
    this.router.get("/statistics/admin/dashboard", authenticate, authorize(UserRole.ADMIN),                this.getAdminDashboardStatistics.bind(this));
  }

  private async getDashboardStatistics(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    try {
      const result = await this.statisticsService.getDashboardStatistics(userId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, StatisticsLogMessages.getDashboardStatisticsFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: StatisticsMessages.fetchDashboardStatisticsFailed,
      });
    }
  }

  private async getAdminDashboardStatistics(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.statisticsService.getAdminDashboardStatistics();
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, StatisticsLogMessages.getAdminDashboardStatisticsFailed, err instanceof Error ? err : null);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: StatisticsMessages.fetchAdminStatisticsFailed,
      });
    }
  }

  public getRouter(): Router { return this.router; }
}