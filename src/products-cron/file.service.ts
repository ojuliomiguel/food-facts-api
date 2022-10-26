import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, writeFileSync, readFileSync, read } from "fs";
import { resolve } from 'path';
import * as zlib from 'zlib';

@Injectable()
export class FileService {
  public async save(file: Buffer, fileName: string) {
    const gzFilePath = `${this.getPath()}/${fileName}`;
    
    this.ensureExistDir(this.getPath());

    writeFileSync(gzFilePath, file);

    const gzFile = readFileSync(gzFilePath);

    zlib.gunzip(gzFile, (error: Error, result: Buffer) => {
      const jsonFilePath = `${this.getPath()}/${fileName.replace('.gz', '')}`;
      writeFileSync(jsonFilePath, result);
    });

    return;
  }

  private getPath(): string {
    return resolve(__dirname, '../../', 'files/products');
  }

  public ensureExistDir(path: string): void {
    if (!existsSync(path)) {
      mkdirSync(path, {recursive: true});
    }
  }
}