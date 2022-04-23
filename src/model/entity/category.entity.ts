import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Product } from './product.entity';

@Entity({ name: 'categories' })
export class Category extends AbstractNumberPkEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
