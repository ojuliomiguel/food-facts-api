import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from 'src/file/file.module';
import { ProductsCronService } from './products-cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    FileModule
  ],
  controllers: [],
  providers: [ProductsCronService],
})
export class ProductsCronModule {}
