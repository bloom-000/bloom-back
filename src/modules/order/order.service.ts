import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderParams } from './order.interface';
import { Order } from '../../model/entity/order.entity';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
import { OrderProductService } from './order-product/order-product.service';
import { ShippingAddressService } from '../shipping-address/shipping-address.service';
import { CreditCardService } from '../credit-card/credit-card.service';
import { CreateOrderProductParams } from './order-product/order-product.interface';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderProductService: OrderProductService,
    private readonly shippingAddressService: ShippingAddressService,
    private readonly creditCardService: CreditCardService,
    private readonly productService: ProductService,
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
    const order = await this.orderRepository.createOrder({
      ...params,
      itemTotal,
      deliveryFee: 0,
    });

    order.products = await this.orderProductService.createOrderProducts(
      orderProductParams.map((e) => ({
        ...e,
        orderId: order.id,
      })),
    );

    return order;
  }

  async validateOrderById(orderId: number): Promise<void> {
    if (!(await this.orderRepository.existsById(orderId))) {
      throw new NotFoundException(ExceptionMessageCode.ORDER_NOT_FOUND);
    }
  }
}
