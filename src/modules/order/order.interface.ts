import { PageOptionParams } from '../../model/common/page-option.params';

export interface CreateOrderParams {
  deliveryAddressId: number;
  creditCardId: number;
  itemTotal: number;
  deliveryFee: number;
  userId: number;
}

export type FilterOrdersParams = PageOptionParams;
