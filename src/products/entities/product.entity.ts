import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProductStatus } from "../enums/product-status.enum";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code:number

  @Column('enum', {enum: ProductStatus})
  status: ProductStatus

}
