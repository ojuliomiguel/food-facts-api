import { Injectable, Logger } from "@nestjs/common";
import axios from 'axios';
import { Cron } from "@nestjs/schedule";
import { FileService } from "./file.service";

@Injectable()
export class ProductsCronService {

  private readonly logger = new Logger(ProductsCronService.name);

  
  constructor(private readonly fileService: FileService) {}


  @Cron('0 18 * * *')
  public async handleCron() {
    this.logger.debug('Starting download file');
    const fileList = await this.getFileList();
    const file = await this.downloadProductsFile();
    this.fileService.save(file, 'products_01.json.gz');
    return file;

  }

  private async getFileList(): Promise<string[]> {
     const res = 
      await axios.get('https://challenges.coode.sh/food/data/json/index.txt');
    const fileList = res.data.split('\n').filter(f => f !== '');
     return fileList;
  }


  private async downloadProductsFile() {
    const { url, configs } = this.buildProductsHttpRequest();

    const request = await axios.get(url, configs);

    const stream = request.data;
    const file: Uint8Array[] = [];

    const promiseStreamProcess = new Promise<Buffer>((resolve, reject) => {
      
      stream.on('data', (data: Uint8Array) => {
        file.push(data)
      });

      stream.on('end', () => {
        resolve(Buffer.concat(file))
      });

      stream.on('error', (error) => {
        reject(new Error(error))
      });

    });

    const producstFile = await promiseStreamProcess;
    return producstFile;
  }

  private buildProductsHttpRequest():  any {
    const baseUrl = 
      'https://challenges.coode.sh/food/data/json/products_01.json.gz';

    return {
      url: baseUrl,
      configs: {
        method: 'GET',
        responseType: 'stream'
      }
    };
  }

}