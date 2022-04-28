export interface CreateDeliveryAddressParams {
  fullName: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  isDefault: boolean;
  userId: string;
}

export type UpdateDeliveryAddressParams = Partial<
  Omit<CreateDeliveryAddressParams, 'userId'>
>;
