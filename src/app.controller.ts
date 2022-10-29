import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as os from 'os';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus() {
    return {
      memoryUsage: process.memoryUsage().heapUsed,
      uptime: os.uptime()
    }
  }
}
