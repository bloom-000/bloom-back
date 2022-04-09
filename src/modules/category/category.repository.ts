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
  async categoryWithNameExists(categoryName: string): Promise<boolean> {
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
      .orderBy('categories.created_at', 'DESC')
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
}