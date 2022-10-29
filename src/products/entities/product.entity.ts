import { 
  
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { ProductStatus } from "../enums/product-status.enum";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: "bigint"})
  code: number

  @Column('enum', {enum: ProductStatus, default: ProductStatus.PUBLISHED})
  status: ProductStatus;

  @CreateDateColumn({name: 'imported_t'})
  importedT: Date;

  @Column({type: "varchar"})
  url: string;

  @Column({type: "varchar"})
  creator: string;

  @CreateDateColumn({name: 'created_t'})
  createdT: Date;

  @CreateDateColumn({name: 'last_modified_t'})
  lastModifiedT: Date;

  @Column({type: 'varchar', name: 'product_name'})
  productName: string;

  @Column({type: "varchar"})
  quantity: string;

  @Column({type: "varchar"})
  brands: string;

  @Column({type: "text"})
  categories: string;

  @Column({type: "text"})
  labels: string;

  @Column({type: "varchar"})
  cities: string;

  @Column({type: "varchar", name: 'purchase_places'})
  purchasePlaces: string;

  @Column({type: "varchar"})
  stores: string;
  
  @Column({type: "text", name: 'ingredients_text'})
  ingredientsText: string;

  @Column({type: "text"})
  traces: string;

  @Column({type: "varchar", name: 'serving_size'})
  servingSize: string;

  @Column({type: "float", name: 'serving_quantity', default: 0.0 })
  servingQuantity: number;

  @Column({type: "float", name: 'nutriscore_score', default: 0.0})
  nutriscoreScore: number;

  @Column({type: "varchar", name: 'nutriscore_grade'})
  nutriscoreGrade: string;

  @Column({type: "varchar", name: 'main_category'})
  mainCategory: string;

  @Column({type: "varchar", name: 'image_url'})
  imageUrl: string;

  @DeleteDateColumn({name: 'deleted_at'})
  deletedAt: Date;

}
