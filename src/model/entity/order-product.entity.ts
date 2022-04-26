import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';

@Entity({ name: 'order_products' })
export class OrderProduct extends AbstractNumberPkEntity {
  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
