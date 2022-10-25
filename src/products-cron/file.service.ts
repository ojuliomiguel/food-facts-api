import { Injectable } from "@nestjs/common";

@Injectable()
export class FileService {
  public async save(file: Buffer, fileName: string) {
    console.log('savedFile');
    return;
  }
}