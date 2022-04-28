import { EntityRepository, QueryRunner, Repository } from 'typeorm';
import { Order } from '../../model/entity/order.entity';
import { CreateOrderParams, FilterOrdersParams } from './order.interface';
import { DataPage } from '../../model/common/data-page';

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

  async getOrders(params: FilterOrdersParams): Promise<DataPage<Order>> {
    const { page, pageSize } = params;

    const [data, total] = await this.createQueryBuilder('orders')
      .select(['orders', 'user.id', 'user.fullName', 'user.email', ''])
      .leftJoin('orders.user', 'user')
      .orderBy('orders.createdAt')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  async getOrderDetails(orderId: string): Promise<Order | undefined> {
    return this.createQueryBuilder('orders')
      .select(['orders', 'user.id', 'user.fullName'])
      .leftJoin('orders.user', 'user')
      .leftJoinAndSelect('orders.products', 'products')
      .leftJoinAndSelect('products.product', 'orderProduct')
      .leftJoinAndSelect('orders.deliveryAddress', 'deliveryAddress')
      .where('orders.id = :orderId', { orderId })
      .getOne();
  }
}
