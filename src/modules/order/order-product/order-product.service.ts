import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrderProductRepository } from './order-product.repository';
import { CreateOrderProductParams } from './order-product.interface';
import { OrderProduct } from '../../../model/entity/order-product.entity';
import { OrderService } from '../order.service';
import { ProductService } from '../../product/product.service';

@Injectable()
export class OrderProductService {
  constructor(
    private readonly orderProductRepository: OrderProductRepository,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  async createOrderProducts(
    params: CreateOrderProductParams[],
  ): Promise<OrderProduct[]> {
    for (const { productId, orderId } of params) {
      await this.productService.validateProductById(productId);
      await this.orderService.validateOrderById(orderId);
    }

    return this.orderProductRepository.createOrderProducts(params);
  }
}
