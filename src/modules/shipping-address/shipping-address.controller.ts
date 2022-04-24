import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ShippingAddressService } from './shipping-address.service';
import { ShippingAddress } from '../../model/entity/shipping-address.entity';
import {
  CurrentUserPayload,
  CurrentUserPayloadInterceptor,
} from '../../decorator/current-user-payload.decorator';
import { UserPayload } from '../../model/common/user.payload';
import { CreateShippingAddressDto } from '../../model/dto/shipping-address/create-shipping-address.dto';
import { UpdateShippingAddressDto } from '../../model/dto/shipping-address/update-shipping-address.dto';

@ApiTags('shipping-addresses')
@Controller('/shipping-addresses')
export class ShippingAddressController {
  constructor(
    private readonly shippingAddressService: ShippingAddressService,
  ) {}

  @ApiCreatedResponse()
  @Post()
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async createShippingAddress(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Body() body: CreateShippingAddressDto,
  ): Promise<ShippingAddress> {
    return this.shippingAddressService.createShippingAddress({
      ...body,
      userId: currentUserPayload.userId,
    });
  }

  @ApiOkResponse()
  @Patch('/:id')
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async updateShippingAddress(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Body() body: UpdateShippingAddressDto,
    @Param('id', ParseIntPipe) shippingAddressId: number,
  ): Promise<ShippingAddress> {
    return this.shippingAddressService.updateShippingAddress(
      currentUserPayload.userId,
      shippingAddressId,
      body,
    );
  }

  @ApiOkResponse()
  @Delete('/:id')
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async deleteShippingAddress(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Param('id', ParseIntPipe) shippingAddressId: number,
  ): Promise<void> {
    return this.shippingAddressService.deleteShippingAddress(
      currentUserPayload.userId,
      shippingAddressId,
    );
  }
}
