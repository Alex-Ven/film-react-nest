import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // или массив ['http://localhost:5173']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Films')
    .setDescription('API documentation for Films project')
    .setVersion('1.0')
    .addTag('films')
    .addServer('/api/afisha')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document);

  app.setGlobalPrefix('api/afisha');
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}/api/afisha`);
}
bootstrap();
