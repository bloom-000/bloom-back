import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CartProductService } from './cart-product.service';
import { UpsertCartProductDto } from '../../model/dto/cart-product/upsert-cart-product.dto';
import {
  CurrentUserPayload,
  CurrentUserPayloadInterceptor,
} from '../../decorator/current-user-payload.decorator';
import { UserPayload } from '../../model/common/user.payload';
import { PageOptionsDto } from '../../model/dto/common/page-options.dto';
import { DataPageDto } from '../../model/dto/common/data-page.dto';
import { CartProduct } from '../../model/entity/cart-product.entity';

@ApiTags('cart-products')
@Controller('/cart-products')
export class CartProductController {
  constructor(private readonly cartProductService: CartProductService) {}

  @ApiOkResponse()
  @Post()
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async upsertCartProduct(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Body() body: UpsertCartProductDto,
  ): Promise<void> {
    return this.cartProductService.upsertCartProduct({
      ...body,
      userId: currentUserPayload.userId,
    });
  }

  @ApiOkResponse()
  @Get()
  @UseInterceptors(CurrentUserPayloadInterceptor)
  async getCartProducts(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Query() pageOptions: PageOptionsDto,
  ): Promise<DataPageDto<CartProduct>> {
    return this.cartProductService.getCartProducts({
      ...pageOptions,
      userId: currentUserPayload.userId,
    });
  }
}
