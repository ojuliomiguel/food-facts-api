import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductsRepository } from './repositories/products.repository';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  
  constructor(private productsRepository: ProductsRepository) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  @OnEvent('products-to-import')
   bulkInsert(producst: any[]) {
    this.logger.log('BulkInsert event trigged');

    this.productsRepository.bulk(producst);
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
