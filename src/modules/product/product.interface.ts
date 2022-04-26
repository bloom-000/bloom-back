import { PageOptionParams } from '../../model/common/page-option.params';

export interface CreateProductParams {
  name: string;
  categoryId: number;
  description?: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
  isPromotion: boolean;
}

export type UpdateProductParams = Partial<CreateProductParams> & {
  keepImageIds?: number[];
};

export type GetProductParams = PageOptionParams;
