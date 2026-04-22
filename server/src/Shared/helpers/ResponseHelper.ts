import { Response } from "express";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";

export class ResponseHelper {
  public static send<T>(res: Response, result: ServiceResult<T>): void {
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      ...(result.data !== undefined ? { data: result.data } : {}),
    });
  }
}