import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { FileService } from './file.service';
import { FileRepository } from './repositories/file.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([File])
  ],
  controllers: [],
  providers: [FileRepository, FileService],
  exports: [FileRepository, FileService]
})
export class FileModule {}
