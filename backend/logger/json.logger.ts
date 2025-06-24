import { LoggerService, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsonLogger implements LoggerService {
  private readonly logFile: string;

  constructor(private readonly logsDir?: string) {
    if (logsDir) {
      this.logFile = path.join(logsDir, 'app.log');
      this.ensureLogsDirectory();
    }
  }

  private ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private writeToFile(message: string) {
    if (this.logFile) {
      fs.appendFileSync(this.logFile, message + '\n', 'utf8');
    }
  }

  private formatMessage(
    level: string,
    message: any,
    context?: string,
    stack?: string,
  ) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      stack,
    };
    const jsonMessage = JSON.stringify(logEntry);
    this.writeToFile(jsonMessage);
    return jsonMessage;
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
