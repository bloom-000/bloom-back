import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../../model/entity/product.entity';
import {
  CreateProductParams,
  GetProductParams,
  UpdateProductParams,
} from './product.interface';
import { DataPage } from '../../model/common/data-page';

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

  async deleteProduct(productId: number): Promise<boolean> {
    const result = await this.softDelete({ id: productId });

    return !!result.affected;
  }

  async getProducts(params: GetProductParams): Promise<DataPage<Product>> {
    const { page, pageSize } = params;

    const [data, total] = await this.createQueryBuilder('products')
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
      .leftJoin('products.category', 'categories')
      .orderBy('products.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  async getById(productId: number): Promise<Product | undefined> {
    return this.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.images', 'images')
      .where('products.id = :productId', { productId })
      .getOne();
  }

  async existsById(productId: number): Promise<boolean> {
    const count = await this.createQueryBuilder('products')
      .where('products.id = :productId', { productId })
      .getCount();

    return count > 0;
  }

  async getProductPrices(
    productIds: number[],
  ): Promise<{ productId: number; price: number; stockQuantity: number }[]> {
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
}
