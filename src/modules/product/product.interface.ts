import { PageOptionParams } from '../../model/common/page-option.params';

export interface CreateProductParams {
  name: string;
  categoryId: number;
  description?: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
}

export type UpdateProductParams = Partial<CreateProductParams>;

export type GetProductParams = PageOptionParams;
