import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'delivery_addresses' })
export class DeliveryAddress extends AbstractNumberPkEntity {
  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'country' })
  country: string;

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'street_address' })
  streetAddress: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column({ name: 'is_default' })
  isDefault: boolean;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
