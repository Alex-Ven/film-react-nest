import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import * as path from 'node:path';
import { FilmsModule } from './films/films.module';
//import { OrderModule } from './order/order.module';
import { DatabaseModule } from './config/databaseModule';
import { OrderModule } from './order/order.module';

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
        index: false, // Отключаем поиск index.html
        redirect: false,
      },
    }),
    process.env.DATABASE_DRIVER === 'mongodb'
      ? DatabaseModule.forMongoDB()
      : DatabaseModule.forPostgreSQL(),
    process.env.DATABASE_DRIVER === 'mongodb'
      ? FilmsModule.forMongoDB()
      : FilmsModule.forPostgreSQL(),
    OrderModule,
  ],
})
export class AppModule {}
