import { LoggerService, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TskvLogger implements LoggerService {
  private readonly logFile: string | null;

  constructor(private readonly logsDir?: string) {
    if (logsDir) {
      this.logFile = path.join(logsDir, 'app.tskv.log');
      this.ensureLogsDirectory();
    } else {
      this.logFile = null;
    }
  }

  private ensureLogsDirectory() {
    if (this.logsDir && !fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
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

  private formatEntry(fields: Record<string, string>): string {
    return Object.entries(fields)
      .map(([key, value]) => {
        const escapedValue = String(value)
          .replace(/\n/g, '\\n')
          .replace(/\t/g, '\\t')
          .replace(/\r/g, '\\r');
        return `${key}=${escapedValue}`;
      })
      .join('\t');
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ) {
    const entry: Record<string, string> = {
      timestamp: new Date().toISOString(),
      level,
      message: String(message),
    };

    if (context) entry.context = context;
    if (stack) entry.stack = stack;

    const formatted = this.formatEntry(entry);
    this.writeToFile(formatted);
    return formatted;
  }

  log(message: string, context?: string) {
    const formatted = this.formatMessage('log', message, context);
    console.log(formatted);
  }

  error(message: string, trace?: string, context?: string) {
    const formatted = this.formatMessage('error', message, context, trace);
    console.error(formatted);
  }

  warn(message: string, context?: string) {
    const formatted = this.formatMessage('warn', message, context);
    console.warn(formatted);
  }

  debug(message: string, context?: string) {
    const formatted = this.formatMessage('debug', message, context);
    console.debug(formatted);
  }

  verbose(message: string, context?: string) {
    const formatted = this.formatMessage('verbose', message, context);
    console.log(formatted);
  }
}
