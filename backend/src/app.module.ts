import { Module } from '@nestjs/common';
import {configProvider} from "./app.config.provider";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from "node:path";

@Module({
  imports: [
      ServeStaticModule.forRoot({
        rootPath: path.join(process.cwd(), 'public'),
      })
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
