import { PageOptionParams } from '../../model/common/page-option.params';
import { OrderStatus } from '../../model/enum/order-status.enum';

export interface CreateOrderParams {
  deliveryAddressId: string;
  creditCardId: string;
  userId: string;
  itemTotal: number;
  deliveryFee: number;
  status: OrderStatus;
}

export type FilterOrdersParams = PageOptionParams;
