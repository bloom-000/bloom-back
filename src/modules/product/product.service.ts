import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import {
  CreateProductParams,
  GetProductParams,
  UpdateProductParams,
} from './product.interface';
import { Product } from '../../model/entity/product.entity';
import { CreateProductImageParams } from './product-image/product-image.interface';
import { ProductImageService } from './product-image/product-image.service';
import { CategoryService } from '../category/category.service';
import { ExceptionMessageCode } from '../../common/exception-message-code.enum';
import { DataPage } from '../../model/common/data-page';
import { basename } from 'path';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productImageService: ProductImageService,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(
    params: Omit<
      CreateProductParams,
      'imageIds' | 'primaryImagePath' | 'rating'
    > & {
      images: Omit<CreateProductImageParams, 'productId'>[];
    },
  ): Promise<Product> {
    await this.categoryService.validateCategoryById(params.categoryId);
    if (await this.productRepository.existsByName(params.name)) {
      throw new ConflictException(
        ExceptionMessageCode.PRODUCT_NAME_ALREADY_USED,
      );
    }

    const product = await this.productRepository.createProduct({
      ...params,
      primaryImagePath: basename(params.images[0].imagePath),
      rating: 0,
    });

    product.images = await this.productImageService.createProductImages(
      params.images.map((e) => ({
        ...e,
        imagePath: basename(e.imagePath),
        productId: product.id,
      })),
    );

    return product;
  }

  async updateProduct(
    productId: string,
    params: Omit<UpdateProductParams, 'imageIds'> & {
      images: Omit<CreateProductImageParams, 'productId'>[];
    },
  ): Promise<Product> {
    const { categoryId, images } = params;

    delete params.images;

    if (categoryId) await this.categoryService.validateCategoryById(categoryId);

    const product = await this.productRepository.updateProduct(
      productId,
      params,
    );
    if (!product) {
      throw new NotFoundException(ExceptionMessageCode.PRODUCT_NOT_FOUND);
    }

    await this.productImageService.deleteImagesForProduct(
      productId,
      params.keepImageIds,
    );
    if (images) {
      product.images = await this.productImageService.createProductImages(
        images.map((e) => ({
          ...e,
          productId,
          imagePath: basename(e.imagePath),
        })),
      );
    }

    return product;
  }

  async deleteProduct(productId: string): Promise<void> {
    const didDelete = await this.productRepository.deleteProduct(productId);
    if (!didDelete) {
      throw new NotFoundException(ExceptionMessageCode.PRODUCT_NOT_FOUND);
    }

    await this.productImageService.deleteImagesForProduct(productId);
  }

  async getProducts(params: GetProductParams): Promise<DataPage<Product>> {
    return this.productRepository.getProducts(params);
  }

  async getProductById(productId: string): Promise<Product> {
    const product = await this.productRepository.getById(productId);
    if (!product) {
      throw new NotFoundException(ExceptionMessageCode.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  async validateProductById(productId: string): Promise<void> {
    if (!(await this.productRepository.existsById(productId))) {
      throw new NotFoundException(ExceptionMessageCode.PRODUCT_NOT_FOUND);
    }
  }

  async calculateProductsPrice(
    params: { productId: string; quantity: number }[],
  ): Promise<number> {
    const productPrices = await this.productRepository.getProductPrices(
      params.map((e) => e.productId),
    );

    if (productPrices.length !== params.length) {
      throw new NotFoundException(ExceptionMessageCode.PRODUCT_NOT_FOUND);
    }

    let itemTotal = 0;
    for (const { productId, stockQuantity, price } of productPrices) {
      const quantity = params.find((e) => e.productId === productId).quantity;

      if (stockQuantity < quantity) {
        throw new BadRequestException(
          ExceptionMessageCode.INSUFFICIENT_STOCK_QUANTITY,
        );
      }

      itemTotal += quantity * price;
    }

    return itemTotal;
  }

  async getPromotedProducts(): Promise<Product[]> {
    return this.productRepository.getPromoted();
  }

  async getProductStockQuantityById(productId: string): Promise<number> {
    return this.productRepository.getStockQuantityById(productId);
  }
}
