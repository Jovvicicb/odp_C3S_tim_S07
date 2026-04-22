import { ServiceResult } from "./ServiceResult";

export class ServiceResultFactory {
  public static ok<T>(message: string, data?: T, status = 200): ServiceResult<T> {
    return {
      success: true,
      status,
      message,
      data,
    };
  }

  public static fail<T = void>(message: string, status = 500): ServiceResult<T> {
    return {
      success: false,
      status,
      message,
    };
  }
}