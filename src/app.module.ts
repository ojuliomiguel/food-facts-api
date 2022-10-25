import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './task.service';
import { ProductsModule } from './products/products.module';
import { ProductsCronModule } from './products-cron/products-cron.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProductsModule,
    ProductsCronModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
