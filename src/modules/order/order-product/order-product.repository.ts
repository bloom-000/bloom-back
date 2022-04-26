import { EntityRepository, QueryRunner, Repository } from 'typeorm';
import { OrderProduct } from '../../../model/entity/order-product.entity';
import { CreateOrderProductParams } from './order-product.interface';

@EntityRepository(OrderProduct)
export class OrderProductRepository extends Repository<OrderProduct> {
  async createOrderProducts(
    params: CreateOrderProductParams[],
    qr?: QueryRunner,
  ): Promise<OrderProduct[]> {
    const entities = params.map((e) => this.create(e));

    if (qr) {
      return qr.manager.save<OrderProduct>(entities);
    }
    return this.save(entities, qr);
  }
}
