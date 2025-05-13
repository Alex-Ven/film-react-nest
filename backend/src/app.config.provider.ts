const applicationConfig = process.env;

export const configProvider = {
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
