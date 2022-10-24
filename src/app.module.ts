import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './task.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProductsModule
  ],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule {}
