import { PageOptionParams } from '../../model/common/page-option.params';

export interface CreateCartProductParams {
  productId: string;
  userId: string;
  quantity: number;
}

export type UpdateCartProductParams = Partial<
  Omit<CreateCartProductParams, 'userId' | 'productId'>
>;

export interface GetCartProductParams extends PageOptionParams {
  userId: string;
}
