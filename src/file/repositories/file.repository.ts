import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { File } from '../entities/file.entity'

@Injectable()
export class FileRepository {

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) { }

  public async save(file: object) {
    const savedRowFile = await this.fileRepository.save(file);
    return savedRowFile;
  }

  public async findRowFiles(files: string[]) {
    const rowFiles = await this.fileRepository
      .find({ where: { fileName: In(files) } });
    return rowFiles;
  }


}