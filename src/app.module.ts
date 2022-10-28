import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsModule } from './products/products.module';
import { ProductsCronModule } from './products-cron/products-cron.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/database.config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),
    EventEmitterModule.forRoot(),
    ProductsModule,
    ProductsCronModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
