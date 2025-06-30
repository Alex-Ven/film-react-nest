import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggerFactory } from 'src/logger/logger.factory';
import { LoggerType } from 'src/logger/logger.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggerFactory = app.get(LoggerFactory);
  const loggerType = (process.env.LOGGER_TYPE as LoggerType) || 'dev';
  const logger = loggerFactory.createLogger(loggerType);

//   app.enableCors(
//   //   {
//   //   origin: [
//   //     'https://afisha.justforstudy.nomorepartiessbs.ru',
//   //     'http://localhost:5173' // для разработки
//   //   ],
//   //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   //   allowedHeaders: 'Content-Type,Authorization',
//   //   credentials: true,
//   // }
// );

  app.setGlobalPrefix('');

  app.useLogger(logger);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Using logger type: ${loggerType}`);
}
bootstrap();
