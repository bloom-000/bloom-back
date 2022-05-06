import { Injectable } from '@nestjs/common';
import { CartProductRepository } from './cart-product.repository';
import {
  CreateCartProductParams,
  GetCartProductParams,
} from './cart-product.interface';
import { DataPage } from '../../model/common/data-page';
import { CartProduct } from '../../model/entity/cart-product.entity';

@Injectable()
export class CartProductService {
  constructor(private readonly cartProductRepository: CartProductRepository) {}

  async upsertCartProduct(params: CreateCartProductParams): Promise<void> {
    const cartProductId =
      await this.cartProductRepository.getIdByUserIdAndProductId(params);
    if (cartProductId) {
      if (params.quantity === 0) {
        await this.cartProductRepository.deleteById(cartProductId);
        return;
      }

      await this.cartProductRepository.updateCartProduct(cartProductId, params);
      return;
    }

    if (params.quantity === 0) {
      return;
    }

    await this.cartProductRepository.createCartProduct(params);
  }

  async deleteCartProductsByProductIds(
    authUserId: string,
    productIds: string[],
  ): Promise<void> {
    return this.cartProductRepository.deleteByProductIds(
      authUserId,
      productIds,
    );
  }

  async getCartProducts(
    params: GetCartProductParams,
  ): Promise<DataPage<CartProduct>> {
    return this.cartProductRepository.getDataPage(params);
  }
}
