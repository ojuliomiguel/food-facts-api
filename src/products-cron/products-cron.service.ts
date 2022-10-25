import { Injectable, Logger } from "@nestjs/common";
import axios from 'axios';
import { Cron } from "@nestjs/schedule";

@Injectable()
export class ProductsCronService {

  private readonly logger = new Logger(ProductsCronService.name);


  @Cron('*/59 * * * * *')
  public async handleCron() {
    this.logger.debug('Starting download file');
    const file = await this.downloadProductsFile();
    return file;

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