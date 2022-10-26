import { Product } from "src/products/entities/product.entity";
import { DataSourceOptions } from "typeorm";

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5477,
  username: 'julio',
  password: 'code42',
  database: 'food_facts',
  entities: [Product],
  synchronize: true,
}