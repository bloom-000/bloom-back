import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage extends AbstractNumberPkEntity {
  @Column({ name: 'image_path' })
  imagePath: string;

  @Column({ name: 'order' })
  order: number;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
