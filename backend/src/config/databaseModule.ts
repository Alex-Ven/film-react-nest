import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

export const getDatabaseModule = (driver: string) => {
  if (driver === 'postgres') {
    return TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    });
  }

  return MongooseModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      uri: `${configService.get('DATABASE_URL')}/${configService.get('DATABASE_NAME')}`,
    }),
    inject: [ConfigService],
  });
};
