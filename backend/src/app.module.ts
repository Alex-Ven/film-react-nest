import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import * as path from 'node:path';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { getDatabaseModule } from './config/databaseModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'public'),
      serveRoot: '/content/afisha',
    }),
    getDatabaseModule(process.env.DATABASE_DRIVER),
    FilmsModule.forRoot(process.env.DATABASE_DRIVER as 'postgres' | 'mongodb'),
    OrderModule,
  ],
  controllers: [],
})
export class AppModule {}
