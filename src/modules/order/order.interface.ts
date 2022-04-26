export interface CreateOrderParams {
  shippingAddressId: number;
  creditCardId: number;
  itemTotal: number;
  deliveryFee: number;
}
