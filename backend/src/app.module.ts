import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as path from 'node:path';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'public'),
      serveRoot: '/content/afisha',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.get<string>('DATABASE_URL')}/${configService.get<string>('DATABASE_NAME')}`,
      }),
      inject: [ConfigService],
    }),
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
})
export class AppModule {}
