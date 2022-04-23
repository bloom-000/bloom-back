import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../../model/entity/category.entity';
import {
  CreateCategoryParams,
  GetCategoriesParams,
  UpdateCategoryParams,
} from './category.interface';
import { DataPage } from '../../model/common/data-page';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async categoryExistsWithName(categoryName: string): Promise<boolean> {
    const count = await this.createQueryBuilder('categories')
      .where('categories.name = :categoryName', { categoryName })
      .getCount();

    return count > 0;
  }

  async createCategory(params: CreateCategoryParams): Promise<Category> {
    const entity = this.create(params);

    return this.save(entity);
  }

  async getCategories(
    params: GetCategoriesParams,
  ): Promise<DataPage<Category>> {
    const { page, pageSize } = params;

    const [data, total] = await this.createQueryBuilder('categories')
      .leftJoin('categories.products', 'products')
      .loadRelationCountAndMap(
        'categories.productCount',
        'categories.products',
        'productsCount',
      )
      .orderBy('categories.createdAt', 'DESC')
      .groupBy('categories.id')
      .addGroupBy('products.id')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  async updateCategory(
    categoryId: number,
    params: UpdateCategoryParams,
  ): Promise<Category | undefined> {
    const category = await this.findOne({ where: { id: categoryId } });
    if (!category) {
      return undefined;
    }

    return this.save({
      ...category,
      ...params,
    });
  }

  async categoryExistsWithId(categoryId: number): Promise<boolean> {
    const count = await this.createQueryBuilder('categories')
      .where('categories.id = :categoryId', { categoryId })
      .getCount();

    return count > 0;
  }

  async deleteCategory(categoryId: number): Promise<boolean> {
    const result = await this.softDelete({ id: categoryId });

    return !!result.affected;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.createQueryBuilder('categories')
      .where('categories.id = :id', { id })
      .getOne();
  }

  async getAllCategories() {
    return this.find();
  }
}
