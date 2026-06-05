import { Request, Response, Router } from "express";


import { UserRole } from "../../Domain/enums/users/UserRole";
import { IStatisticsService } from "../../Domain/services/statistics/IStatisticsService";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { StatisticsMessages } from "../../Domain/constants/messages/statistics/StatisticsMessages";
import { StatisticsLogMessages } from "../../Domain/constants/messages/statistics/StatisticsLogMessages";

export class StatisticsController {
  private readonly router: Router;

  constructor(
    private readonly statisticsService: IStatisticsService,
    private readonly logger: ILoggerService,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/statistics/dashboard",           authenticate, authorize(UserRole.USER, UserRole.ADMIN), this.getDashboardStatistics.bind(this));
    this.router.get("/statistics/admin/dashboard",     authenticate,authorize(UserRole.ADMIN),this.getAdminDashboardStatistics.bind(this));
  }

  getRouter(): Router {
    return this.router;
  }

  private async getDashboardStatistics(req: Request, res: Response,): Promise<void> {
    const userId = req.user!.id;

    try {
      const result = await this.statisticsService.getDashboardStatistics(userId);
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(
        this.constructor.name,
        StatisticsLogMessages.getDashboardStatisticsFailed,
        err instanceof Error ? err : null,
      );

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: StatisticsMessages.fetchDashboardStatisticsFailed,
      });
    }
  }



  private async getAdminDashboardStatistics(req: Request, res: Response,): Promise<void> {
    try {
      const result = await this.statisticsService.getAdminDashboardStatistics();
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(
        this.constructor.name,
        StatisticsLogMessages.getAdminDashboardStatisticsFailed,
        err instanceof Error ? err : null,
      );

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: StatisticsMessages.fetchAdminStatisticsFailed,
      });
    }
  }
}