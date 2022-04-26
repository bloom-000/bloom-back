import { EntityRepository, Repository } from 'typeorm';
import { OrderProduct } from '../../../model/entity/order-product.entity';
import { CreateOrderProductParams } from './order-product.interface';

@EntityRepository(OrderProduct)
export class OrderProductRepository extends Repository<OrderProduct> {
  async createOrderProducts(
    params: CreateOrderProductParams[],
  ): Promise<OrderProduct[]> {
    const entities = params.map((e) => this.create(e));

    return this.save(entities);
  }
}
