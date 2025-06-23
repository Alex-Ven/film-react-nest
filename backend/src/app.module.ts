import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import * as path from 'node:path';
import { FilmsModule } from './films/films.module';
import { DatabaseModule } from './config/databaseModule';
import { OrderModule } from './order/order.module';
import { AppController } from './films/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public'),
      serveRoot: '/content/afisha',
      exclude: ['/api*'],
      serveStaticOptions: {
        index: false,
        redirect: false,
      },
    }),
    process.env.DATABASE_DRIVER === 'mongodb'
      ? DatabaseModule.forMongoDB()
      : DatabaseModule.forPostgreSQL(),
    process.env.DATABASE_DRIVER === 'mongodb'
      ? FilmsModule.forMongoDB()
      : FilmsModule.forPostgreSQL(),
    process.env.DATABASE_DRIVER === 'mongodb'
      ? OrderModule.forMongoDB()
      : OrderModule.forPostgreSQL(),
  ],
  controllers: [AppController],
})
export class AppModule {}
