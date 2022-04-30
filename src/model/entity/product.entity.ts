import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Order } from './order.entity';

@Entity({ name: 'products' })
export class Product extends AbstractNumberPkEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'price', type: 'real' })
  price: number;

  @Column({ name: 'old_price', type: 'real', nullable: true })
  oldPrice: number;

  @Column({ name: 'stock_quantity' })
  stockQuantity: number;

  @Column({ name: 'is_promotion' })
  isPromotion: boolean;

  @Column({ name: 'primary_image_path' })
  primaryImagePath: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  images: ProductImage[];

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}
