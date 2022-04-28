import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DeliveryAddress } from './delivery-address.entity';
import { CreditCard } from './credit-card.entity';
import { OrderProduct } from './order-product.entity';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { User } from './user.entity';
import { OrderStatus } from '../enum/order-status.enum';

@Entity({ name: 'orders' })
export class Order extends AbstractNumberPkEntity {
  @Column({ name: 'delivery_address_id' })
  deliveryAddressId: string;

  @Column({ name: 'credit_card_id' })
  creditCardId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'total', type: 'real' })
  itemTotal: number;

  @Column({ name: 'delivery_fee', type: 'real' })
  deliveryFee: number;

  @Column({ name: 'status', type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  products: OrderProduct[];

  @ManyToOne(() => DeliveryAddress)
  @JoinColumn({ name: 'delivery_address_id' })
  deliveryAddress: DeliveryAddress;

  @ManyToOne(() => CreditCard)
  @JoinColumn({ name: 'credit_card_id' })
  creditCard: CreditCard;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
