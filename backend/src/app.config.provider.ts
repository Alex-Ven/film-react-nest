import {ConfigModule} from "@nestjs/config";

export const configProvider = {
    imports: [ConfigModule.forRoot()],
    provide: 'CONFIG',
    useValue: < AppConfig> {
        //TODO прочесть переменнные среды
    },
}

export interface AppConfig {
    database: AppConfigDatabase
}

export interface AppConfigDatabase {
    driver: string
    url: string
}
