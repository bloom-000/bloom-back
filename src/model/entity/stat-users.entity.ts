import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'stat_users' })
export class StatUsers extends AbstractNumberPkEntity {
  @Column({ name: 'count' })
  count: number;
}
