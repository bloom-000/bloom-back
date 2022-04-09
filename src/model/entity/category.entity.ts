import { Column, Entity } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';

@Entity({ name: 'categories' })
export class Category extends AbstractNumberPkEntity {
  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;
}
