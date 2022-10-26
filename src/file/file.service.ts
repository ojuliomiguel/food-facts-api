import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, writeFileSync, readFileSync, read } from "fs";
import { resolve } from 'path';
import * as zlib from 'zlib';
import { FileData } from "./interfaces/file-data.interface";
import { FileRepository } from "./repositories/file.repository";

@Injectable()
export class FileService {

  constructor(private readonly fileRepository: FileRepository) {

  }

  public async findRowFile(fileName: string) {
    const rowFile = await this.fileRepository.findRowFile(fileName);
    return rowFile;
  }

  public async save(file: Buffer, fileName: string) {
    const gzFilePath = `${this.getPath()}/${fileName}`;
    const jsonFilePath = `${this.getPath()}/${fileName.replace('.gz', '')}`;

    this.ensureExistDir(this.getPath());

    writeFileSync(gzFilePath, file);

    const gzFile = readFileSync(gzFilePath);

    await zlib.gunzip(gzFile, (error: Error, result: Buffer) => {
      writeFileSync(jsonFilePath, result);
    });

    const fileData: FileData = {
      path: jsonFilePath,
      fileName
    }

    await this.fileRepository.save(fileData);

    return;
  }

  private getPath(): string {
    return resolve(__dirname, '../../', 'files/products');
  }

  public ensureExistDir(path: string): void {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  }
}