import { EntityRepository, Repository } from 'typeorm';
import { CartProduct } from '../../model/entity/cart-product.entity';
import {
  CreateCartProductParams,
  GetCartProductParams,
  UpdateCartProductParams,
} from './cart-product.interface';
import { DataPage } from '../../model/common/data-page';

@EntityRepository(CartProduct)
export class CartProductRepository extends Repository<CartProduct> {
  async createCartProduct(
    params: CreateCartProductParams,
  ): Promise<CartProduct> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async getIdByUserIdAndProductId({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }): Promise<string> {
    const result = await this.createQueryBuilder('cartProducts')
      .select('cartProducts.id', 'id')
      .where('cartProducts.productId = :productId', { productId })
      .andWhere('cartProducts.userId = :userId', { userId })
      .getRawOne();

    return result?.id;
  }

  async updateCartProduct(
    id: string,
    params: UpdateCartProductParams,
  ): Promise<CartProduct | undefined> {
    const cartProduct = await this.findOne({ where: { id } });
    if (!cartProduct) {
      return undefined;
    }

    return this.save({
      id,
      productId: cartProduct.productId,
      userId: cartProduct.userId,
      quantity: params.quantity ?? cartProduct.quantity,
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.delete({ id });

    return !!result.affected;
  }

  async deleteByProductIds(
    userId: string,
    productIds: string[],
  ): Promise<void> {
    await this.createQueryBuilder()
      .where('userId = :userId', { userId })
      .andWhere('productId IN (:...productIds)', { productIds })
      .delete()
      .execute();
  }

  async getDataPage(
    params: GetCartProductParams,
  ): Promise<DataPage<CartProduct>> {
    const { userId, page, pageSize } = params;

    const [data, total] = await this.createQueryBuilder('cartProducts')
      .leftJoinAndSelect('cartProducts.product', 'product')
      .where('cartProducts.userId = :userId', { userId })
      .orderBy('cartProducts.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  async getAllByUserId(userId: string): Promise<CartProduct[]> {
    return this.createQueryBuilder('cartProducts')
      .leftJoinAndSelect('cartProducts.product', 'product')
      .where('cartProducts.userId = :userId', { userId })
      .orderBy('cartProducts.createdAt', 'DESC')
      .getMany();
  }
}
