import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { User } from './user.entity';

@Entity({ name: 'credit_cards' })
export class CreditCard extends AbstractNumberPkEntity {
  @Column({ name: 'number' })
  number: string;

  @Column({ name: 'holder_name' })
  holderName: string;

  @Column({ name: 'cvv' })
  cvv: string;

  @Column({ name: 'expiry_date', type: 'timestamptz' })
  expiryDate: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'is_default' })
  isDefault: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
