import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../../model/dto/order/create-order.dto';
import { Order } from '../../model/entity/order.entity';

@ApiTags('orders')
@Controller('/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiCreatedResponse()
  @Post()
  async createOrder(@Body() body: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(body, body.products);
  }
}
