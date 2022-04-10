export interface CreateProductParams {
  name: string;
  categoryId: number;
  description?: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
  imageIds?: number[];
}
