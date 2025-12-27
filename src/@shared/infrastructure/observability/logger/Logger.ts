/**
 * Logger Interface & Implementation
 *
 * @layer Shared/Infrastructure
 */

export interface ILogger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

class ConsoleLogger implements ILogger {
  private log(level: string, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    const method =
      level === "error" ? "error" : level === "warn" ? "warn" : "log";
    console[method](JSON.stringify(logEntry, null, 2));
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.log("error", message, meta);
  }
}

export const logger: ILogger = new ConsoleLogger();
