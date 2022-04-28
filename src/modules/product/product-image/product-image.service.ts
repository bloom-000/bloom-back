import { Injectable } from '@nestjs/common';
import { ProductImageRepository } from './product-image.repository';
import { CreateProductImageParams } from './product-image.interface';
import { ProductImage } from '../../../model/entity/product-image.entity';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
  ) {}

  async createProductImages(
    params: CreateProductImageParams[],
  ): Promise<ProductImage[]> {
    return this.productImageRepository.createProductImages(params);
  }

  async deleteImagesForProduct(
    productId: string,
    keepImageIds?: string[],
  ): Promise<void> {
    await this.productImageRepository.deleteImagesByProductId(
      productId,
      keepImageIds,
    );
  }
}
