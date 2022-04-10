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
}
