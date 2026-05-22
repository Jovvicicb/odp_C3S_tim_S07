export interface ILoggerService {
  info(context: string, message: string): void;
  warn(context: string, message: string): void;
  error(context: string, message: string, err?: Error | null): void;
  debug(context: string, message: string): void;
}