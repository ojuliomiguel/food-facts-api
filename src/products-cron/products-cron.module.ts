import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FileService } from './file.service';
import { ProductsCronService } from './products-cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [ProductsCronService, FileService],
})
export class ProductsCronModule {}
