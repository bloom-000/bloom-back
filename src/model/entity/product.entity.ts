import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';

@Entity({ name: 'products' })
export class Product extends AbstractNumberPkEntity {
  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'price', type: 'real' })
  price: number;

  @Column({ name: 'old_price', type: 'real', nullable: true })
  oldPrice: number;

  @Column({ name: 'stock_quantity' })
  stockQuantity: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  images: ProductImage[];
}
