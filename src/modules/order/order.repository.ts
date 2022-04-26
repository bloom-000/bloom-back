import { EntityRepository, Repository } from 'typeorm';
import { Order } from '../../model/entity/order.entity';
import { CreateOrderParams } from './order.interface';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async createOrder(params: CreateOrderParams): Promise<Order> {
    const entity = await this.create(params);

    return this.save(entity);
  }

  async existsById(orderId: number): Promise<boolean> {
    const count = await this.createQueryBuilder('orders')
      .where('orders.id = :orderId', { orderId })
      .getCount();

    return count > 0;
  }
}
