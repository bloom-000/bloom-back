import {
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
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
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
    params: Omit<CreateProductParams, 'imageIds'> & {
      images: Omit<CreateProductImageParams, 'productId'>[];
    },
  ): Promise<Product> {
    await this.categoryService.validateCategoryById(params.categoryId);
    if (await this.productRepository.productExistsWithName(params.name)) {
      throw new ConflictException(
        ExceptionMessageCode.PRODUCT_NAME_ALREADY_USED,
      );
    }

    const product = await this.productRepository.createProduct(params);

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
    productId: number,
    params: Omit<UpdateProductParams, 'imageIds'> & {
      images: Omit<CreateProductImageParams, 'productId'>[];
    },
  ): Promise<Product> {
    const { name, categoryId, images } = params;

    delete params.images;

    if (categoryId) await this.categoryService.validateCategoryById(categoryId);

    if (name && (await this.productRepository.productExistsWithName(name))) {
      throw new ConflictException(
        ExceptionMessageCode.PRODUCT_NAME_ALREADY_USED,
      );
    }

    const product = await this.productRepository.updateProduct(
      productId,
      params,
    );
    if (!product) {
      throw new NotFoundException(ExceptionMessageCode.PRODUCT_NOT_FOUND);
    }

    if (images) {
      product.images = await this.productImageService.updateImagesForProduct(
        productId,
        images.map((e) => ({ ...e, productId })),
      );
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<void> {
    const didDelete = await this.productRepository.deleteProduct(productId);
    if (!didDelete) {
      throw new NotFoundException(ExceptionMessageCode.PRODUCT_NOT_FOUND);
    }

    await this.productImageService.deleteImagesForProduct(productId);
  }

  async getProducts(params: GetProductParams): Promise<DataPage<Product>> {
    return this.productRepository.getProducts(params);
  }

  async getProductById(productId: number): Promise<Product> {
    const product = await this.productRepository.getById(productId);
    if (!product) {
      throw new NotFoundException(ExceptionMessageCode.PRODUCT_NOT_FOUND);
    }

    return product;
  }
}
