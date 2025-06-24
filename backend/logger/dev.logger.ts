// src/logger/dev.logger.ts
import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { inspect } from 'util';

@Injectable()
export class DevLogger extends ConsoleLogger {
  private readonly logPath: string;
  private initialized = false;
  private readonly logFile: string | null;
  private readonly colors = {
    log: '\x1b[32m', // green
    error: '\x1b[31m', // red
    warn: '\x1b[33m', // yellow
    debug: '\x1b[36m', // cyan
    verbose: '\x1b[35m', // magenta
  };
  private readonly resetColor = '\x1b[0m';

  constructor(
    context?: string,
    private readonly logsDir?: string,
  ) {
    super(context);
    if (logsDir) {
      this.logFile = path.join(logsDir, 'app.dev.log');
      this.ensureLogsDirectory();
    } else {
      this.logFile = null;
    }
    this.setLogLevels(['log', 'error', 'warn', 'debug', 'verbose']);
  }

  private ensureLogsDirectory() {
    try {
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true });
      }
      // Создаем пустой файл при инициализации
      fs.writeFileSync(this.logPath, '');
    } catch (err) {
      console.error(`Logger initialization failed: ${err.message}`);
      this.initialized = false;
    }
  }

  private writeToFile(message: string) {
    if (this.logFile) {
      try {
        fs.appendFileSync(this.logFile, message + '\n', 'utf8');
      } catch (err) {
        console.error(`Failed to write logs to file: ${err.message}`);
      }
    }
  }

  protected formatContext(context: string): string {
    return context ? `[${context}] ` : '';
  }

  protected formatMessage(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextPart = this.formatContext(context);
    const formattedMessage =
      typeof message === 'object'
        ? inspect(message, { colors: false, depth: 5 })
        : message;

    let logMessage = `${timestamp} ${level.toUpperCase()} ${contextPart}${formattedMessage}`;

    if (stack) {
      logMessage += `\n${stack}`;
    }

    return logMessage;
  }

  private logWithColor(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ) {
    const formatted = this.formatMessage(level, message, context, stack);
    const colored = `${this.colors[level]}${formatted}${this.resetColor}`;

    // Запись в файл без цветовых кодов
    this.writeToFile(formatted);

    return colored;
  }

  log(message: string, context?: string) {
    const formatted = this.logWithColor('log', message, context);
    super.log(formatted, context);
  }

  error(message: string, trace?: string, context?: string) {
    const formatted = this.logWithColor('error', message, context, trace);
    super.error(formatted, trace, context);
  }

  warn(message: string, context?: string) {
    const formatted = this.logWithColor('warn', message, context);
    super.warn(formatted, context);
  }

  debug(message: string, context?: string) {
    const formatted = this.logWithColor('debug', message, context);
    super.debug(formatted, context);
  }

  verbose(message: string, context?: string) {
    const formatted = this.logWithColor('verbose', message, context);
    super.verbose(formatted, context);
  }
}
