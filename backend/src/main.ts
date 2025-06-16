import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Создаём экземпляр билдера Swagger-документации
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
  app.enableCors({
    origin: [
      'http://afisha.justforstudy.nomorepartiessbs.ru',
      'https://afisha.justforstudy.nomorepartiessbs.ru',
      'http://api.afisha.justforstudy.nomorepartiessbs.ru', // Добавили API-поддомен
      'https://api.afisha.justforstudy.nomorepartiessbs.ru',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  app.listen(3000, '0.0.0.0', () => {
    console.log('Сервер запущен на http://0.0.0.0:3000');
  });
}
bootstrap();
