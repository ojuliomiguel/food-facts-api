import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Product } from '../entities/product.entity'

@Injectable()
export class ProductsRepository {

  constructor(
    @InjectRepository(Product)
    private fileRepository: Repository<Product>
  ) { }

  // public async findAll() {
  //   this.fileRepository
  //     .cre
  // }

  public async bulk(products: any[]) {
    this.fileRepository
      .createQueryBuilder()
      .insert()
      .values(products)
      .execute()
  }
}