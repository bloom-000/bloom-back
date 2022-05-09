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
import { ExceptionMessageCode } from '../../common/exception-message-code.enum';
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
    categoryId: string,
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

  async validateCategoryById(categoryId: string): Promise<void> {
    if (!(await this.categoryRepository.categoryExistsWithId(categoryId))) {
      throw new NotFoundException(ExceptionMessageCode.CATEGORY_NOT_FOUND);
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const didDelete = await this.categoryRepository.deleteCategory(categoryId);
    if (!didDelete) {
      throw new NotFoundException(ExceptionMessageCode.CATEGORY_NOT_FOUND);
    }
  }

  async getCategory(id: string) {
    const category = await this.categoryRepository.getCategoryById(id);
    if (!category) {
      throw new NotFoundException(ExceptionMessageCode.CATEGORY_NOT_FOUND);
    }

    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.getAllCategories();
  }
}
