import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'stat_income' })
export class StatIncome extends AbstractNumberPkEntity {
  @Column({ name: 'amount', type: 'real' })
  amount: number;

  @Column({ name: 'order_count', nullable: true })
  orderCount: number | undefined;
}
