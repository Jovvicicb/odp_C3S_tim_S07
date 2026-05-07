import { Request, Response, Router } from "express";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { HealthMessages } from "../../Domain/constants/messages/health/HealthMessages";
import { HealthLogMessages } from "../../Domain/constants/messages/health/HealthLogMessages";
import { IHealthService } from "../../Domain/services/health/IHealthService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { ResponseHelper } from "../../Shared/helpers/ResponseHelper";

export class HealthController {
  private readonly router = Router();

  public constructor(
    private readonly healthService: IHealthService,
    private readonly logger: ILoggerService
  ) {
    this.router.get("/health",                                                    this.getHealth.bind(this));
    this.router.get("/health/db",        authenticate, authorize(UserRole.ADMIN), this.getDbHealth.bind(this));
    this.router.post("/health/failover", authenticate, authorize(UserRole.ADMIN), this.triggerFailover.bind(this));
  }

  private async getHealth(req: Request, res: Response): Promise<void> {
    try {
      res.status(HttpStatus.ok).json({
        success: true,
        message: HealthMessages.serverHealthy,
        data: {
          status: "healthy",
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      this.logger.error(this.constructor.name, HealthLogMessages.getHealthFailed, err);

      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: HealthMessages.serverHealthFailed,
      });
    }
  }

  private async getDbHealth(req: Request, res: Response): Promise<void> {
    try {
        const result = await this.healthService.getDbHealth();
        ResponseHelper.send(res, result);
    } catch (err) {
        this.logger.error(this.constructor.name, HealthLogMessages.getDbHealthFailed, err);

        res.status(HttpStatus.internalServerError).json({
        success: false,
        message: HealthMessages.dbHealthFetchFailed,
        });
    }
  }

  private async triggerFailover(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.healthService.triggerFailover();
      ResponseHelper.send(res, result);
    } catch (err) {
      this.logger.error(this.constructor.name, HealthLogMessages.failoverFailed, err);
      
      res.status(HttpStatus.internalServerError).json({
        success: false,
        message: HealthMessages.failoverFailed,
      });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}