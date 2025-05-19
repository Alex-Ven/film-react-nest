import { ConfigModule } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    //TODO прочесть переменнные среды
    database: {
      driver: process.env.DATABASE_DRIVER,
      url: `${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`,
    },
  },
};

@Injectable()
export class AppConfig {
  database: AppConfigDatabase;
}

export class AppConfigDatabase {
  driver: string;
  url: string;
}
