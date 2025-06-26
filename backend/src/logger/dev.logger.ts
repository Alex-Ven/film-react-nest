import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { inspect } from 'util';

@Injectable()
export class DevLogger implements LoggerService {
  private readonly logFile: string | null;
  private initialized = false;
  private readonly colors = {
    log: '\x1b[32m', // green
    error: '\x1b[31m', // red
    warn: '\x1b[33m', // yellow
    debug: '\x1b[36m', // cyan
    verbose: '\x1b[35m', // magenta
  };
  private readonly resetColor = '\x1b[0m';

  constructor(private readonly logsDir?: string) {
    if (logsDir) {
      this.logFile = path.join(logsDir, 'app.dev.log');
      this.ensureLogsDirectory();
    } else {
      this.logFile = null;
    }
  }

  private ensureLogsDirectory() {
    if (!this.logFile) return;

    try {
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true });
      }
      if (!fs.existsSync(this.logFile)) {
        fs.writeFileSync(this.logFile, '');
      }
      this.initialized = true;
    } catch (err) {
      console.error(`Logger initialization failed: ${err.message}`);
      this.initialized = false;
    }
  }

  private writeToFile(message: string) {
    if (!this.initialized || !this.logFile) return;

    try {
      fs.appendFileSync(this.logFile, message + '\n', 'utf8');
    } catch (err) {
      console.error(`Failed to write logs to file: ${err.message}`);
    }
  }

  private formatMessage(
    level: string,
    message: any,
    context?: string,
    stack?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextPart = context ? `[${context}] ` : '';
    const formattedMessage =
      typeof message === 'object'
        ? inspect(message, { colors: false, depth: 5 })
        : message;

    let logMessage = `${timestamp} ${level.toUpperCase()} ${contextPart}${formattedMessage}`;

    if (stack) {
      logMessage += `\n${stack}`;
    }

    // Запись в файл без цветовых кодов
    this.writeToFile(logMessage);

    // Добавляем цвета для консоли
    return `${this.colors[level]}${logMessage}${this.resetColor}`;
  }

  log(message: any, context?: string) {
    const formatted = this.formatMessage('log', message, context);
    console.log(formatted);
  }

  error(message: any, trace?: string, context?: string) {
    const formatted = this.formatMessage('error', message, context, trace);
    console.error(formatted);
  }

  warn(message: any, context?: string) {
    const formatted = this.formatMessage('warn', message, context);
    console.warn(formatted);
  }

  debug(message: any, context?: string) {
    const formatted = this.formatMessage('debug', message, context);
    console.debug(formatted);
  }

  verbose(message: any, context?: string) {
    const formatted = this.formatMessage('verbose', message, context);
    console.log(formatted);
  }
}
