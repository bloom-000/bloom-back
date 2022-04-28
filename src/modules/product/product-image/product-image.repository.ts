import { EntityRepository, Repository } from 'typeorm';
import { ProductImage } from '../../../model/entity/product-image.entity';
import { CreateProductImageParams } from './product-image.interface';

@EntityRepository(ProductImage)
export class ProductImageRepository extends Repository<ProductImage> {
  async createProductImages(
    params: CreateProductImageParams[],
  ): Promise<ProductImage[]> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async deleteImagesByProductId(
    productId: string,
    keepImageIds?: string[],
  ): Promise<void> {
    const query = await this.createQueryBuilder().where(
      'productId = :productId',
      { productId },
    );
    if (keepImageIds) {
      query.andWhere('id NOT IN (:...keepImageIds)', { keepImageIds });
    }
    await query.softDelete().execute();
  }
}
