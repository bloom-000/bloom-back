import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../../model/entity/product.entity';
import { CreateProductParams, UpdateProductParams } from './product.interface';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(params: CreateProductParams): Promise<Product> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async productExistsWithName(productName: string): Promise<boolean> {
    const count = await this.createQueryBuilder('products')
      .where('products.name = :productName', { productName })
      .getCount();

    return count > 0;
  }

  async updateProduct(
    productId: number,
    params: UpdateProductParams,
  ): Promise<Product | undefined> {
    const product = await this.findOne({
      where: { id: productId },
      relations: ['images'],
    });
    if (!product) {
      return undefined;
    }

    return this.save({
      ...product,
      ...params,
    });
  }
}
