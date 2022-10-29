import { Injectable, Logger } from "@nestjs/common";
import axios from 'axios';
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { FileService } from "../file/file.service";
import { FolderName } from "src/common/enums/folder-name.enum";
import { createReadStream } from 'fs';
import readline = require('readline');
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CronJob } from "cron";

@Injectable()
export class ProductsCronService {

  private readonly logger = new Logger(ProductsCronService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly fileService: FileService,
    private eventEmitter: EventEmitter2
  ) { }

  onModuleInit() {
    const job = new CronJob(process.env.CRON_EXPRESSION, () => {
      this.manageProductsFile()
    });
  
    this.schedulerRegistry.addCronJob('import products', job);
    job.start();
  }

  private async manageProductsFile() {
    const notImportedFiles = await this.getNotImportedFiles();

    if (!notImportedFiles.length) {
      return
    }
    const FIRST = 0;
    const fileToImport = notImportedFiles[FIRST];
    const fileName = fileToImport.replace('.gz', '')

    const file = await this.downloadProductsFile(fileToImport);

    await this.fileService.save(file, fileToImport, FolderName.PRODUCTS);

    const products = await this.getProductsFromJsonFile(fileName);
    
    this.eventEmitter.emit(
      'products-to-import',
      products
    );
  }

  public async getNotImportedFiles(): Promise<string[]> {
    const filesListFromServer = await this.requestFilesListFromServer();
    const filesRow = await this.fileService.findRowFiles(filesListFromServer);
    const importedFiles = filesRow.map(f => f.fileName);
    const notImportedFiles =
      filesListFromServer.filter(f => !importedFiles.includes(f));
    return notImportedFiles;
  }

  private async requestFilesListFromServer(): Promise<string[]> {
    const res =
      await axios.get(`${process.env.BASE_URL}/food/data/json/index.txt`);
    const fileList = res.data.split('\n').filter(f => f !== '');
    return fileList;
  }


  private async downloadProductsFile(fileName: string) {
    const { url, configs } = this.buildProductsHttpRequest(fileName);

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

  private buildProductsHttpRequest(fileName: string): any {
    const baseUrl =
      `${process.env.BASE_URL}/food/data/json/${fileName}`;

    return {
      url: baseUrl,
      configs: {
        method: 'GET',
        responseType: 'stream'
      }
    };
  }

  private async getProductsFromJsonFile(fileName: string, limit = 100) {
    const filePath =
      `${this.fileService.getPath(FolderName.PRODUCTS)}/${fileName}`
    const readStream = createReadStream(filePath, { encoding: "utf8" });
    
    const file = readline.createInterface({
      input: readStream,
      output: process.stdout,
      terminal: false
    });

    let products = [];

    for await (const line of file) {
      if (products.length === limit) {
        break;
      }
      products.push(JSON.parse(line))
    }

    this.logger.log('Mapping producsts from json file');

    products = products.map(p => {
      return {
        code: !isNaN(Number(p.code)) ? Number(p.code): 0,
        url: p.url,
        creator: p.creator,
        productName: p.product_name,
        quantity: !isNaN(Number(p.quantity)) ? Number(p.quantity): 0,
        brands: p.brands,
        categories: p.categories,
        labels: p.labels,
        cities: p.cities,
        purchasePlaces: p.purchase_places,
        stores: p.stores,
        ingredientsText: p.ingredients_text,
        traces: p.traces,
        servingSize: !isNaN(Number(p.serving_size)) ? Number(p.serving_size) : 0,
        servingQuantity: 
          !isNaN(Number(p.serving_quantity)) ?  Number(p.serving_quantity) : 0,
        nutriscoreScore: 
          !isNaN(Number(p.nutriscore_score)) ? Number(p.nutriscore_score) : 0,
        nutriscoreGrade: 
          !isNaN(Number(p.nutriscore_grade)) ? Number(p.nutriscore_grade) : 0,
        mainCategory: p.main_category,
        imageUrl: p.image_url
      }
    })

    this.logger.log(' Finished Mapping producsts from json file');

    return products;
  }
}