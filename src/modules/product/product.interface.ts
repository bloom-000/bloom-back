export interface CreateProductParams {
  name: string;
  categoryId: number;
  description?: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
}

export type UpdateProductParams = Partial<CreateProductParams>;
