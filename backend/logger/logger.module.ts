// src/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerFactory } from './logger.factory';
import { LoggerType } from './logger.types';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    LoggerFactory,
    {
      provide: 'LOGGER_OPTIONS',
      useFactory: (config: ConfigService) => ({
        type: config.get('LOGGER_TYPE', 'dev'),
        logsDir: config.get('LOGS_DIR', './logs'),
      }),
      inject: [ConfigService],
    },
    {
      provide: 'BASE_LOGGER',
      useFactory: (
        factory: LoggerFactory,
        options: { type: string; logsDir?: string },
      ) => {
        return factory.createLogger(
          options.type as LoggerType,
          options.logsDir,
        );
      },
      inject: [LoggerFactory, 'LOGGER_OPTIONS'],
    },
  ],
  exports: [LoggerFactory, 'BASE_LOGGER'],
})
export class LoggerModule {}
