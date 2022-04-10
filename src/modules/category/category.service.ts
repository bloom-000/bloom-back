import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from '../../model/entity/category.entity';
import {
  CreateCategoryParams,
  GetCategoriesParams,
  UpdateCategoryParams,
} from './category.interface';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
import { DataPage } from '../../model/common/data-page';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(params: CreateCategoryParams): Promise<Category> {
    if (await this.categoryRepository.categoryExistsWithName(params.name)) {
      throw new ConflictException(
        ExceptionMessageCode.CATEGORY_NAME_ALREADY_USED,
      );
    }

    return this.categoryRepository.createCategory(params);
  }

  async getCategories(
    params: GetCategoriesParams,
  ): Promise<DataPage<Category>> {
    return this.categoryRepository.getCategories(params);
  }

  async updateCategory(
    categoryId: number,
    params: UpdateCategoryParams,
  ): Promise<Category> {
    const category = await this.categoryRepository.updateCategory(
      categoryId,
      params,
    );
    if (!category) {
      throw new NotFoundException(ExceptionMessageCode.CATEGORY_NOT_FOUND);
    }

    return category;
  }

  async validateCategoryById(categoryId: number): Promise<void> {
    if (!(await this.categoryRepository.categoryExistsWithId(categoryId))) {
      throw new NotFoundException(ExceptionMessageCode.CATEGORY_NOT_FOUND);
    }
  }
}
