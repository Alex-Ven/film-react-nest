// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('db')
export class AppController {
  @Get('info')
  getDbInfo() {
    return {
      driver: process.env.DATABASE_DRIVER,
      env: process.env.NODE_ENV || 'development',
    };
  }
}
