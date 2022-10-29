import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Product } from '../entities/product.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ProductStatus } from "../enums/product-status.enum";

@Injectable()
export class ProductsRepository {

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>
  ) { }

  public async update(id: string, product: any) {
    return this.productsRepository.createQueryBuilder()
      .update({
        ...product,
      })
      .where({
        id: id,
      })
      .returning('*')
      .execute()
  }

  public async findOne(id: string): Promise<Product | null> {
    const product = await this.productsRepository.findOne({ where: { id: id } })
    return product;
  }

  public async findAll(options: IPaginationOptions): Promise<Pagination<Product>> {
    const queryBuilder = this.productsRepository.createQueryBuilder();
    return paginate<Product>(queryBuilder, options);
  }

  public async remove(id: string) {
    const product = await this.productsRepository.findOne({where: {id: id}})
    product.status = ProductStatus.TRASH
    await this.productsRepository.save(product);
    return await this.productsRepository.softRemove(product);

  }

  public async bulk(products: any[]) {
    this.productsRepository
      .createQueryBuilder()
      .insert()
      .values(products)
      .execute()
  }
}