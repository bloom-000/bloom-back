import { Injectable } from '@nestjs/common';
import { OrderProductRepository } from './order-product.repository';
import { CreateOrderProductParams } from './order-product.interface';
import { OrderProduct } from '../../../model/entity/order-product.entity';
import { ProductService } from '../../product/product.service';
import { QueryRunner } from 'typeorm';

@Injectable()
export class OrderProductService {
  constructor(
    private readonly orderProductRepository: OrderProductRepository,
    private readonly productService: ProductService,
  ) {}

  async createOrderProducts(
    params: CreateOrderProductParams[],
    qr?: QueryRunner,
  ): Promise<OrderProduct[]> {
    for (const { productId } of params) {
      await this.productService.validateProductById(productId);
    }

    return this.orderProductRepository.createOrderProducts(params, qr);
  }
}
