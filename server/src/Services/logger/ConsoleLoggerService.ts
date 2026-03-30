import { ILoggerService } from "../../Domain/services/logger/ILoggerService";

const RESET  = "\x1b[0m";
const GRAY   = "\x1b[90m";
const CYAN   = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RED    = "\x1b[31m";
const BLUE   = "\x1b[34m";

const ts = (): string => new Date().toISOString().replace("T", " ").substring(0, 19);

export class ConsoleLoggerService implements ILoggerService {
  info(context: string, message: string): void {
    console.log(`${GRAY}${ts()}${RESET} ${CYAN}[INFO]${RESET} ${GRAY}[${context}]${RESET} ${message}`);
  }

  warn(context: string, message: string): void {
    console.warn(`${GRAY}${ts()}${RESET} ${YELLOW}[WARN]${RESET} ${GRAY}[${context}]${RESET} ${message}`);
  }

  error(context: string, message: string, err?: unknown): void {
    const detail = err instanceof Error ? ` — ${err.message}` : err ? ` — ${String(err)}` : "";
    console.error(`${GRAY}${ts()}${RESET} ${RED}[ERROR]${RESET} ${GRAY}[${context}]${RESET} ${message}${detail}`);
  }

  debug(context: string, message: string): void {
    if (process.env.NODE_ENV === "production") return;
    console.log(`${GRAY}${ts()}${RESET} ${BLUE}[DEBUG]${RESET} ${GRAY}[${context}]${RESET} ${message}`);
  }
}
