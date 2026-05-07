import { Request, Response, Router } from "express";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { ILoggerService } from "../../Domain/services/logger/ILoggerService";
import { HealthMessages } from "../../Domain/constants/messages/helth/HelthMessages";
import { HealthLogMessages } from "../../Domain/constants/messages/helth/HelthLogMessages";

export class HealthController {
  private readonly router = Router();

  public constructor(
    private readonly logger: ILoggerService
  ) {
    this.router.get("/health", this.getHealth.bind(this));
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

  public getRouter(): Router {
    return this.router;
  }
}