import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeliveryAddressService } from './delivery-address.service';
import { DeliveryAddress } from '../../model/entity/delivery-address.entity';
import {
  CurrentUserPayload,
  CurrentUserPayloadInterceptor,
} from '../../decorator/current-user-payload.decorator';
import { UserPayload } from '../../model/common/user.payload';
import { CreateDeliveryAddressDto } from '../../model/dto/delivery-address/create-delivery-address.dto';
import { UpdateDeliveryAddressDto } from '../../model/dto/delivery-address/update-delivery-address.dto';

@ApiTags('delivery-addresses')
@Controller('/delivery-addresses')
export class DeliveryAddressController {
  constructor(
    private readonly deliveryAddressService: DeliveryAddressService,
  ) {}

  @ApiCreatedResponse()
  @Post()
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async createDeliveryAddress(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Body() body: CreateDeliveryAddressDto,
  ): Promise<DeliveryAddress> {
    return this.deliveryAddressService.createShippingAddress({
      ...body,
      userId: currentUserPayload.userId,
    });
  }

  @ApiOkResponse()
  @Patch('/:id')
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async updateShippingAddress(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Body() body: UpdateDeliveryAddressDto,
    @Param('id', ParseIntPipe) deliveryAddressId: number,
  ): Promise<DeliveryAddress> {
    return this.deliveryAddressService.updateDeliveryAddress(
      currentUserPayload.userId,
      deliveryAddressId,
      body,
    );
  }

  @ApiOkResponse()
  @Delete('/:id')
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async deleteDeliveryAddress(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Param('id', ParseIntPipe) deliveryAddressId: number,
  ): Promise<void> {
    return this.deliveryAddressService.deleteDeliveryAddress(
      currentUserPayload.userId,
      deliveryAddressId,
    );
  }

  @ApiOkResponse()
  @Get('/default')
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async getDefaultShippingAddress(
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<DeliveryAddress> {
    return this.deliveryAddressService.getDefaultShippingAddress(
      currentUserPayload.userId,
    );
  }

  @ApiOkResponse()
  @Get()
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async getShippingAddresses(
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<DeliveryAddress[]> {
    return this.deliveryAddressService.getShippingAddresses(
      currentUserPayload.userId,
    );
  }
}
