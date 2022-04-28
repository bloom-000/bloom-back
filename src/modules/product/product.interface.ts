import { PageOptionParams } from '../../model/common/page-option.params';

export interface CreateProductParams {
  name: string;
  categoryId: string;
  description?: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
  isPromotion: boolean;
}

export type UpdateProductParams = Partial<CreateProductParams> & {
  keepImageIds?: string[];
};

export type GetProductParams = PageOptionParams;
