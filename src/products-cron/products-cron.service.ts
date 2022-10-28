import { Injectable, Logger } from "@nestjs/common";
import axios from 'axios';
import { Cron } from "@nestjs/schedule";
import { FileService } from "../file/file.service";
import { FolderName } from "src/common/enums/folder-name.enum";
import { createReadStream } from 'fs';
import readline = require('readline');

@Injectable()
export class ProductsCronService {

  private readonly logger = new Logger(ProductsCronService.name);

  constructor(private readonly fileService: FileService) { }

  @Cron('*/30 * * * * *')
  public async handleCron() {
    this.logger.log('Starting download file');
    await this.manageProductsFile();
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
    return products;
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
      await axios.get('https://challenges.coode.sh/food/data/json/index.txt');
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
      `https://challenges.coode.sh/food/data/json/${fileName}`;

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
      `${this.fileService.getPath(FolderName.PRODUCTS)}/${'products_08.json'}`
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

    products = products.map(p => {
      return {
        code: p.code,
        url: p.url,
        creator: p.creator,
        productName: p.product_name,
        quantity: p.quantity,
        brands: p.brands,
        categories: p.categories,
        labels: p.labels,
        cities: p.cities,
        purchasePlaces: p.purchase_places,
        stores: p.stores,
        ingredientsText: p.ingredients_text,
        traces: p.traces,
        servingSize: p.serving_size,
        servingQuantity: p.serving_quantity,
        nutriscoreScore: p.nutriscore_score,
        nutriscoreGrade: p.nutriscore_grade,
        mainCategory: p.main_category,
        imageUrl: p.image_url
      }
    })

    return products;
  }
}