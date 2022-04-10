import { PageOptionParams } from '../../model/common/page-option.params';

export interface CreateCategoryParams {
  name: string;
  description?: string;
}

export type GetCategoriesParams = PageOptionParams;

export type UpdateCategoryParams = Partial<CreateCategoryParams>;
