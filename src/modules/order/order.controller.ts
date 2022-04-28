import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../../model/dto/order/create-order.dto';
import { Order } from '../../model/entity/order.entity';
import { ActionOrder } from '../../common/actions/order.action';
import { Permissions } from '../../decorator/permissions.decorator';
import { FilterOrdersDto } from '../../model/dto/order/filter-orders.dto';
import { DataPageDto } from '../../model/dto/common/data-page.dto';
import {
  CurrentUserPayload,
  CurrentUserPayloadInterceptor,
} from '../../decorator/current-user-payload.decorator';
import { UserPayload } from '../../model/common/user.payload';

@ApiTags('orders')
@Controller('/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiCreatedResponse()
  @Post()
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async createOrder(
    @Body() body: CreateOrderDto,
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<Order> {
    return this.orderService.createOrder(
      { ...body, userId: currentUserPayload.userId },
      body.products,
    );
  }

  @ApiOkResponse()
  @Get()
  @Permissions(ActionOrder.READ_FILTER)
  async getOrders(
    @Query() filter: FilterOrdersDto,
  ): Promise<DataPageDto<Order>> {
    return this.orderService.getOrders(filter);
  }

  @ApiOkResponse()
  @Get('/:id')
  @Permissions(ActionOrder.READ_BY_ID)
  async getOrderDetails(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.orderService.getOrderDetails(id);
  }
}
