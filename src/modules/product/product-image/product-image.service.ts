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

  async updateImagesForProduct(
    productId: number,
    params: CreateProductImageParams[],
  ) {
    await this.productImageRepository.deleteImagesByProductId(productId);
    return this.productImageRepository.createProductImages(params);
  }

  async deleteImagesForProduct(productId: number): Promise<void> {
    await this.productImageRepository.deleteImagesByProductId(productId);
  }
}
