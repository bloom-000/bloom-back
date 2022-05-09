import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderParams, FilterOrdersParams } from './order.interface';
import { Order } from '../../model/entity/order.entity';
import { OrderProductService } from './order-product/order-product.service';
import { DeliveryAddressService } from '../delivery-address/delivery-address.service';
import { CreditCardService } from '../credit-card/credit-card.service';
import { CreateOrderProductParams } from './order-product/order-product.interface';
import { ProductService } from '../product/product.service';
import { runTransaction } from '../../common/transaction';
import { Connection } from 'typeorm';
import { DataPage } from '../../model/common/data-page';
import { ExceptionMessageCode } from '../../common/exception-message-code.enum';
import { OrderStatus } from '../../model/enum/order-status.enum';
import { DateUtils } from '../../common/util/date.utils';
import { CartProductService } from '../cart-product/cart-product.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderProductService: OrderProductService,
    private readonly deliveryAddressService: DeliveryAddressService,
    private readonly creditCardService: CreditCardService,
    private readonly productService: ProductService,
    private readonly connection: Connection,
    private readonly cartProductService: CartProductService,
  ) {}

  async createOrder(
    params: Omit<CreateOrderParams, 'deliveryFee' | 'itemTotal' | 'status'>,
    orderProductParams: Omit<CreateOrderProductParams, 'orderId'>[],
  ): Promise<Order> {
    await this.deliveryAddressService.validateDeliveryAddressById(
      params.deliveryAddressId,
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
          status: OrderStatus.PENDING,
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

      await this.cartProductService.deleteCartProductsByProductIds(
        params.userId,
        orderProductParams.map((e) => e.productId),
      );

      return order;
    });
  }

  async getOrders(params: FilterOrdersParams): Promise<DataPage<Order>> {
    return this.orderRepository.getOrders(params);
  }

  async getOrderDetails(orderId: string): Promise<Order> {
    const order = await this.orderRepository.getOrderDetails(orderId);
    if (!order) {
      throw new NotFoundException(ExceptionMessageCode.ORDER_NOT_FOUND);
    }

    return order;
  }

  async getOrdersAfterMidnight(): Promise<Order[]> {
    return this.orderRepository.getOrdersAfterDate(DateUtils.getMidnight());
  }
}
