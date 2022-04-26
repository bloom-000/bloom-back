import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ShippingAddress } from './shipping-address.entity';
import { CreditCard } from './credit-card.entity';
import { OrderProduct } from './order-product.entity';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';

@Entity({ name: 'orders' })
export class Order extends AbstractNumberPkEntity {
  @Column({ name: 'shipping_address_id' })
  shippingAddressId: number;

  @Column({ name: 'credit_card_id' })
  creditCardId: number;

  @Column({ name: 'total', type: 'real' })
  itemTotal: number;

  @Column({ name: 'delivery_fee', type: 'real' })
  deliveryFee: number;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  products: OrderProduct[];

  @ManyToOne(() => ShippingAddress)
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: ShippingAddress;

  @ManyToOne(() => CreditCard)
  @JoinColumn({ name: 'credit_card_id' })
  creditCard: CreditCard;
}
