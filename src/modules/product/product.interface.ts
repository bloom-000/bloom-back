import { PageOptionParams } from '../../model/common/page-option.params';
import { ProductSortOption } from '../../model/enum/product-sort-option.enum';

export interface CreateProductParams {
  name: string;
  categoryId: string;
  description?: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
  isPromotion: boolean;
  primaryImagePath: string;
  rating: number;
}

export type UpdateProductParams = Partial<CreateProductParams> & {
  keepImageIds?: string[];
};

export interface GetProductParams extends PageOptionParams {
  categoryIds?: string[];
  fromPrice?: number;
  toPrice?: number;
  sortOptions?: ProductSortOption[];
  ratings?: number[];
  searchKeyword?: string;
}
