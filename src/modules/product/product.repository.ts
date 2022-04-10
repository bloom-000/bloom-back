import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../../model/entity/product.entity';
import { CreateProductParams } from './product.interface';

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
}
