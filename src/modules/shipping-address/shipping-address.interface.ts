export interface CreateShippingAddressParams {
  fullName: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  isDefault: boolean;
  userId: number;
}

export type UpdateShippingAddressParams = Partial<
  Omit<CreateShippingAddressParams, 'userId'>
>;
