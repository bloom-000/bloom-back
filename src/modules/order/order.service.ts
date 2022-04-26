import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderParams } from './order.interface';
import { Order } from '../../model/entity/order.entity';
import { OrderProductService } from './order-product/order-product.service';
import { ShippingAddressService } from '../shipping-address/shipping-address.service';
import { CreditCardService } from '../credit-card/credit-card.service';
import { CreateOrderProductParams } from './order-product/order-product.interface';
import { ProductService } from '../product/product.service';
import { runTransaction } from '../../common/transaction';
import { Connection } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderProductService: OrderProductService,
    private readonly shippingAddressService: ShippingAddressService,
    private readonly creditCardService: CreditCardService,
    private readonly productService: ProductService,
    private readonly connection: Connection,
  ) {}

  async createOrder(
    params: Omit<CreateOrderParams, 'deliveryFee' | 'itemTotal'>,
    orderProductParams: Omit<CreateOrderProductParams, 'orderId'>[],
  ): Promise<Order> {
    await this.shippingAddressService.validateShippingAddressById(
      params.shippingAddressId,
    );
    await this.creditCardService.validateCreditCardById(params.creditCardId);

    const itemTotal = await this.productService.calculateProductsPrice(
      orderProductParams,
    );

    return runTransaction(this.connection, async (qr) => {
      const order = await this.orderRepository.createOrder(
        {
          ...params,
          itemTotal,
          deliveryFee: 0,
        },
        qr,
      );

      order.products = await this.orderProductService.createOrderProducts(
        orderProductParams.map((e) => ({
          ...e,
          orderId: order.id,
        })),
        qr,
      );

      return order;
    });
  }
}
