import { EntityRepository, QueryRunner, Repository } from 'typeorm';
import { Order } from '../../model/entity/order.entity';
import { CreateOrderParams } from './order.interface';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async createOrder(
    params: CreateOrderParams,
    qr?: QueryRunner,
  ): Promise<Order> {
    const entity = await this.create(params);

    if (qr) {
      return qr.manager.save<Order>(entity);
    }
    return this.save(entity, qr);
  }

  async existsById(orderId: number): Promise<boolean> {
    const count = await this.createQueryBuilder('orders')
      .where('orders.id = :orderId', { orderId })
      .getCount();

    return count > 0;
  }
}
