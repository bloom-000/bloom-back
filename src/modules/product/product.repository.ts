import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../../model/entity/product.entity';
import {
  CreateProductParams,
  GetProductParams,
  UpdateProductParams,
} from './product.interface';
import { DataPage } from '../../model/common/data-page';
import { ProductSortOption } from '../../model/enum/product-sort-option.enum';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(params: CreateProductParams): Promise<Product> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async existsByName(productName: string): Promise<boolean> {
    const count = await this.createQueryBuilder('products')
      .where('products.name = :productName', { productName })
      .getCount();

    return count > 0;
  }

  async updateProduct(
    productId: string,
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

  async deleteProduct(productId: string): Promise<boolean> {
    const result = await this.softDelete({ id: productId });

    return !!result.affected;
  }

  async getProducts(params: GetProductParams): Promise<DataPage<Product>> {
    const {
      page,
      pageSize,
      categoryIds,
      fromPrice,
      toPrice,
      sortOptions,
      ratings,
      searchKeyword,
    } = params;

    const query = this.createQueryBuilder('products')
      .select([
        'products.createdAt',
        'products.updatedAt',
        'products.deletedAt',
        'products.id',
        'products.name',
        'products.description',
        'products.price',
        'products.oldPrice',
        'products.stockQuantity',
        'images.id',
        'images.createdAt',
        'images.updatedAt',
        'images.deletedAt',
        'images.imagePath',
        'images.order',
        'categories',
      ])
      .leftJoin('products.images', 'images')
      .leftJoin('products.category', 'categories');

    if (categoryIds) {
      query.andWhere('categories.id IN (:...categoryIds)', { categoryIds });
    }
    if (fromPrice) {
      query.andWhere('products.price >= :fromPrice', { fromPrice });
    }
    if (toPrice) {
      query.andWhere('products.price < :toPrice', { toPrice });
    }
    if (ratings) {
      query.andWhere('ROUND(product.rating) IN (:...ratings)', { ratings });
    }
    if (searchKeyword) {
      query.andWhere('products.name LIKE :searchKeyword', {
        searchKeyword: `%${searchKeyword}%`,
      });
    }
    if (sortOptions) {
      for (const option of sortOptions) {
        switch (option) {
          case ProductSortOption.PRICE_LOW_TO_HIGH:
            query.orderBy('products.price', 'ASC');
            break;
          case ProductSortOption.PRICE_HIGH_TO_LOW:
            query.orderBy('products.price', 'DESC');
            break;
          case ProductSortOption.NAME_A_TO_Z:
            query.orderBy('products.name', 'ASC');
            break;
          case ProductSortOption.NAME_Z_TO_A:
            query.orderBy('products.name', 'DESC');
            break;
          case ProductSortOption.CREATION_DATE_HIGH_TO_LOW:
            query.orderBy('products.createdAt', 'DESC');
            break;
          case ProductSortOption.CREATION_DATE_LOW_TO_HIGH:
            query.orderBy('products.createdAt', 'ASC');
            break;
        }

        if (
          !sortOptions.includes(ProductSortOption.CREATION_DATE_LOW_TO_HIGH) &&
          !sortOptions.includes(ProductSortOption.CREATION_DATE_HIGH_TO_LOW)
        ) {
          query.orderBy('products.createdAt', 'DESC');
        }
      }
    } else {
      query.orderBy('products.createdAt', 'DESC');
    }

    const [data, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  async getById(productId: string): Promise<Product | undefined> {
    return this.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.images', 'images')
      .where('products.id = :productId', { productId })
      .getOne();
  }

  async existsById(productId: string): Promise<boolean> {
    const count = await this.createQueryBuilder('products')
      .where('products.id = :productId', { productId })
      .getCount();

    return count > 0;
  }

  async getProductPrices(
    productIds: string[],
  ): Promise<{ productId: string; price: number; stockQuantity: number }[]> {
    if (productIds.length === 0) return [];

    const result = await this.createQueryBuilder('products')
      .select(['products.id', 'products.price', 'products.stockQuantity'])
      .where('products.id IN (:...productIds)', { productIds })
      .getMany();

    return result.map((e) => ({
      productId: e.id,
      price: e.price,
      stockQuantity: e.stockQuantity,
    }));
  }

  async getPromoted(): Promise<Product[]> {
    console.log('called');
    return this.createQueryBuilder('products')
      .where('products.isPromotion = true')
      .getMany();
  }

  async getStockQuantityById(productId: string): Promise<number> {
    const result = await this.createQueryBuilder('products')
      .select('products.stockQuantity', 'stockQuantity')
      .where('products.id = :productId', { productId })
      .getRawOne();

    return result?.stockQuantity;
  }
}
