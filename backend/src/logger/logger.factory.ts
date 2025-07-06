import { Injectable } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';
import { LoggerType } from './logger.types';

@Injectable()
export class LoggerFactory {
  createLogger(type: LoggerType = 'dev', logsDir?: string) {
    switch (type) {
      case 'json':
        return new JsonLogger(logsDir);
      case 'tskv':
        return new TskvLogger(logsDir);
      case 'dev':
      default:
        return new DevLogger(logsDir);
    }
  }
}
