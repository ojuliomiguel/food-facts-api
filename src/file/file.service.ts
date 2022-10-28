import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, writeFileSync, readFileSync, readSync } from "fs";
import { resolve } from 'path';
import * as zlib from 'zlib';
import { FolderName } from "../common/enums/folder-name.enum";
import { FileData } from "./interfaces/file-data.interface";
import { FileRepository } from "./repositories/file.repository";

@Injectable()
export class FileService {

  constructor(private readonly fileRepository: FileRepository) { }

  public async findRowFiles(files: string[]) {
    const rowFile = await this.fileRepository.findRowFiles(files);
    return rowFile;
  }

  public async save(file: Buffer, fileName: string, folderName: FolderName) {
    const gzFilePath = `${this.getPath(folderName)}/${fileName}`;
    const jsonFilePath = 
      `${this.getPath(folderName)}/${fileName.replace('.gz', '')}`;

    this.ensureExistDir(this.getPath(folderName));

    writeFileSync(gzFilePath, file);

    const gzFile = readFileSync(gzFilePath);

    const result = zlib.gunzipSync(gzFile);

    writeFileSync(jsonFilePath, result);

    const fileData: FileData = {
      path: jsonFilePath,
      fileName
    }

    await this.fileRepository.save(fileData);

    return;
  }

  public getPath(folder: string): string {
    return resolve(__dirname, '../../', `files/${folder}`);
  }

  public ensureExistDir(path: string): void {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  }

  public readFile(folderName: FolderName, fileName: string) {
    const filePath = `${this.getPath(folderName)}/${fileName}`;
    const file = readFileSync(filePath)
    return 

  }
}