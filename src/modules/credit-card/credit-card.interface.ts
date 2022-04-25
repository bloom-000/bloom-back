export interface CreateCreditCardParams {
  number: string;
  holderName: string;
  cvv: string;
  expiryDate: Date;
  isDefault: boolean;
  userId: number;
}

export type UpdateCreditCardParams = Partial<
  Omit<CreateCreditCardParams, 'userId'>
>;
