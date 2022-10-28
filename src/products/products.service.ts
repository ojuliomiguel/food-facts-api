import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductsRepository } from './repositories/products.repository';
import {
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Product } from './entities/product.entity';



@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(private productsRepository: ProductsRepository) {}
 
  @OnEvent('products-to-import')
   bulkInsert(producst: any[]) {
    this.logger.log('BulkInsert event trigged');
    this.productsRepository.bulk(producst);
  }

  async findAll(options: IPaginationOptions) {
    const products = await this.productsRepository.findAll(options);
    return products;
  }

  findOne(id: string) {
    return this.productsRepository.findOne(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
